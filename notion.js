"use strict";
console.log("Hello from notion.js")

const token = "secret_cb5N7mQAjQqOyVWRWIeoDZhExfHgrYOW4mcfv3Yk9gE"


const { Client } = require('@notionhq/client');
const notion = new Client({ auth: token });
(async () => {
  //https://www.notion.so/test-f9fb60e00bbd4f8e9a64b1d086cb4fe0
  const databaseId = "f9fb60e00bbd4f8e9a64b1d086cb4fe0"
  const length = databaseId.length
  console.log(length)
  const data = await notion.databases.query({ database_id: databaseId });
  console.log(data);
  // const listUsersResponse = await notion.users.list({})
  // console.log(listUsersResponse)
  // const response = await notion.databases.retrieve({ database_id: databaseId });
  // console.log(response);
})();
