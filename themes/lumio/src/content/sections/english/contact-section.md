---
enable: true
badge: "contact"
title: "Ready to start a conversation? <br /> Let's talk."
description: "Whether you have a specific engagement in mind or just want to explore what makes sense, a short conversation is the right first step."
image: "/images/contact-home.jpg"
imageAlt: "Contact"
characterImage: ""
characterImageAlt: ""

form:
  emailSubject: "New inquiry from ryc.mt"
  submitButton:
    enable: true
    label: "Send Message"
  inputs:
    - label: "Full Name"
      placeholder: "Full Name *"
      name: "Full Name"
      required: true
      halfWidth: true
      defaultValue: ""
    - label: "Email Address"
      placeholder: "Email Address *"
      name: "Email Address"
      required: true
      type: "email"
      halfWidth: true
      defaultValue: ""
    - label: "Company"
      placeholder: "Company (optional)"
      name: "Company"
      required: false
      type: "text"
      halfWidth: true
      defaultValue: ""
    - label: "Engagement Type"
      placeholder: "What type of engagement? *"
      name: "Engagement Type"
      required: true
      halfWidth: true
      dropdown:
        type: "select"
        items:
          - label: "Streaming Architecture Review"
            value: "Streaming Architecture Review"
            selected: false
          - label: "Web3 / Content Rights Feasibility Study"
            value: "Web3 Feasibility Study"
            selected: false
          - label: "Technical Due Diligence"
            value: "Technical Due Diligence"
            selected: false
          - label: "Fractional CTO / Advisory Retainer"
            value: "Fractional CTO Advisory"
            selected: false
          - label: "Other / Not Sure Yet"
            value: "Other"
            selected: false
    - label: "Message"
      tag: "textarea"
      placeholder: "Tell me about your project or the problem you're trying to solve *"
      name: "Message"
      required: true
      halfWidth: false
      rows: "5"
      defaultValue: ""
    - note: success
      parentClass: "hidden text-sm message success"
      content: "Thanks — I'll be in touch within one business day."
    - note: deprecated
      parentClass: "hidden text-sm message error"
      content: "Something went wrong. Please email ryc@askryc.mt directly."
---
