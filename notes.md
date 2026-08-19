# Checklist

<!-- Make sure you fill out this checklist with what you've done before submitting! -->

- [X] Read the README [please please please]
- [ ] Something cool!
- [X] Back-end
  - [X] Minimum Requirements
    - [X] Setup MongoDB database
    - [X] Setup item requests collection
    - [X] `PUT /api/request`
    - [X] `GET /api/request?page=_`
  - [X] Main Requirements
    - [X] `GET /api/request?status=pending`
    - [X] `PATCH /api/request`
  - [X] Above and Beyond
    - [X] Batch edits
    - [X] Batch deletes
- [ ] Front-end
  - [X] Minimum Requirements
    - [X] Dropdown component
    - [X] Table component
    - [X] Base page [table with data]
    - [X] Table dropdown interactivity
  - [X] Main Requirements
    - [X] Pagination
    - [X] Tabs
  - [X] Above and Beyond
    - [X] Batch edits
    - [X] Batch deletes

# Notes

- I created a custom src/server/request.ts page and src/lib/validation/requests.ts page. They both disabled  @typescript-eslint/no-explicit-any rule, becasuse 'any' is needed to validate the proper request, just like in the mock files.
- I changed the approve items section at the top to allow item requests to be added, using the PUT request designed for the Back-end.

