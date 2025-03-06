#!/bin/bash

# Check if the prompt is provided as an argument
if [ -z "$1" ]; then
  echo "Usage: $0 <prompt>"
  exit 1
fi

prompt="$1"
api_key="${GEMINI_KEY}" # Ensure GEMINI_API_KEY is set in your environment

if [ -z "$api_key" ]; then
  echo "Error: GEMINI_API_KEY environment variable not set."
  exit 1
fi

api_url="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${api_key}"

json_payload=$(
  cat <<EOF
{
  "contents": [{
    "parts": [{
      "text": "$prompt"
    }]
  }]
}
EOF
)

response=$(curl -s -X POST \
  -H 'Content-Type: application/json' \
  -d "$json_payload" \
  "$api_url")

# Extract the generated text using jq
generated_text=$(echo "$response" | jq -r '.candidates[0].content.parts[0].text')

# Output the generated text
if [ -n "$generated_text" ]; then
  echo "$generated_text"
else
  echo "Error: Failed to extract generated text or API error."
  echo "$response" #output the raw response for debugging.
  exit 1
fi

exit 0
