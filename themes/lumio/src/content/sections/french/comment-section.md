---
enable: true
title: "Laisser un commentaire"

form:
  emailSubject: "Nouveau commentaire de blog"

  submitButton:
    enable: true
    label: "Publier le commentaire"

  inputs:
    - label: "Nom"
      placeholder: "Nom"
      name: "name"
      type: "text"
      required: true
      halfWidth: true

    - label: "E-mail"
      placeholder: "E-mail"
      name: "email"
      type: "email"
      required: true
      halfWidth: true

    - label: "Sujet"
      placeholder: "Sujet (optionnel)"
      name: "subject"
      type: "text"
      halfWidth: false

    - label: "Message"
      placeholder: "Message"
      name: "message"
      tag: "textarea"
      rows: "7"
      required: true
      halfWidth: false
---
