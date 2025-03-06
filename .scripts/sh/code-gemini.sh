#!/bin/bash

tput civis

prompt="Extract the problem defined in this image as text and respond only with that extracted text only."
api_key="AIzaSyBiPBK4uNFzS6VuCusS0V9MB6ooQzzstIU" # Ensure GEMINI_API_KEY is set in your environment

if [ -z "$api_key" ]; then
  echo "Error: GEMINI_API_KEY environment variable not set."
  exit 1
fi

IMG_PATH="$HOME/pics/screenshots/q.jpeg"
# Screenshot
grim -t jpeg "${IMG_PATH}"

BASE_URL="https://generativelanguage.googleapis.com" # Or the appropriate cloud endpoint.

MIME_TYPE=$(file -b --mime-type "${IMG_PATH}")
NUM_BYTES=$(wc -c <"${IMG_PATH}")
DISPLAY_NAME="screenshot_upload"
tmp_header_file="upload-header.tmp"

# Initial resumable request defining metadata.
curl "${BASE_URL}/upload/v1beta/files?key=${api_key}" \
  -D "${tmp_header_file}" \
  -H "X-Goog-Upload-Protocol: resumable" \
  -H "X-Goog-Upload-Command: start" \
  -H "X-Goog-Upload-Header-Content-Length: ${NUM_BYTES}" \
  -H "X-Goog-Upload-Header-Content-Type: ${MIME_TYPE}" \
  -H "Content-Type: application/json" \
  -d "{'file': {'display_name': '${DISPLAY_NAME}'}}" 2>/dev/null

upload_url=$(grep -i "x-goog-upload-url: " "${tmp_header_file}" | cut -d" " -f2 | tr -d "\r")
rm "${tmp_header_file}"

# Upload the actual bytes.
file_info=$(curl "${upload_url}" \
  -H "Content-Length: ${NUM_BYTES}" \
  -H "X-Goog-Upload-Offset: 0" \
  -H "X-Goog-Upload-Command: upload, finalize" \
  --data-binary "@${IMG_PATH}" 2>/dev/null)

file_uri=$(echo "$file_info" | jq -r ".file.uri")

# Now generate content using that file
response=$(curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${api_key}" \
  -H 'Content-Type: application/json' \
  -X POST \
  -d '{
    "contents": [{
      "parts":[
        {"text": "'"${prompt}"'"},
        {"file_data":
          {"mime_type": "'"${MIME_TYPE}"'",
           "file_uri": "'"${file_uri}"'"}
        }]
      }]
  }' 2>/dev/null)

# Extract the generated text using jq
generated_text=$(echo "$response" | jq -r '.candidates[0].content.parts[0].text')

# Output the generated text
if [ -n "$generated_text" ]; then
  filtered_text=$(echo "$generated_text" | tail -n +2 | head -n -1)

  temp_file="${HOME}/temp.js"
  echo "$filtered_text" | wl-copy
  #>"$temp_file"

  #deno fmt "$temp_file" # Suppress deno fmt output

  clear
  bat -p "$temp_file"
else
  echo "Error: Failed to extract generated text or API error."
  echo "$response" #output the raw response for debugging.
  exit 1
fi

exit 0
