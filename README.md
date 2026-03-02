**Dependencies:**

- .NET SDK 8.x (LTS): Run `dotnet --version` and ensure it starts with `8.`
- Node.js & npm: Ensure you have `Node.js version 20.x` or higher and npm installed
  - Run `node --version` and `npm --version` in your terminal to verify

**Run backend server (.NET 8):**
- Open the project folder in your IDE
- Open the Terminal in your IDE
- From project root, navigate to dir /backend and run:
```
cd backend
dotnet restore
dotnet run
```
- Check http://localhost:3000/ returns "Save the World!"

**Run frontend:**
- Open a NEW Terminal window in the IDE
- From project root, navigate to dir /frontend and run
```
cd frontend
npm install
npm start
```
- Check you can see the UI at http://localhost:3001/

---

**Legal Disclaimer:**

This repository contains proprietary workshop code and materials. The contents are the intellectual property of Commit AI and are provided solely for the purposes of the associated workshop by paying customers.

**You may not use, copy, distribute, or share any part of this code or its contents without explicit written consent from Commit AI.**
