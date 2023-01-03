"use strict";
console.log("Hello from notion.js")

const token = "secret_kKwrMdx9jb2zVcrWqNV8Ur7iO9ML8r1i1EeylEHfy4a"
const databaseId = "7f095051bb9c42c99aab88a7798f702d"

const { Client } = require('@notionhq/client');
const notion = new Client({ auth: token });
(async () => {
  // const data = await notion.databases.query({ database_id: databaseId });
  // console.log(data);
  // const listUsersResponse = await notion.users.list({})
  // console.log(listUsersResponse)
  const response = await notion.databases.retrieve({ database_id: databaseId });
  console.log(response);
})();
