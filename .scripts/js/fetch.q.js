#!/usr/local/bin/qjs
import {urlGet} from "std"
urlGet('wttr.in/London', { full: true })
  .then(response => console.log(response.body))
  .catch(error => console.error(error));
