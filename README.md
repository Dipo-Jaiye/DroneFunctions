### Introduction
There is a major new technology that is destined to be a disruptive force in the field of
transportation: **the drone**. Just as the mobile phone allowed developing countries to
leapfrog older technologies for personal communication, the drone has the potential to
leapfrog traditional transportation infrastructure.
Useful drone functions include the delivery of small items that are (urgently) needed in
locations with difficult access.

- [Introduction](#introduction)
- [Task description](#task-description)
- [Functional Requirements](#functional-requirements)
- [Non Functional Requirements](#non-functional-requirements)
- [Installation](#installation-procedures)
- [Extra additions](#extra-additions)
- [Postman collection for testing locally](#postman-link)

### Task description
We have a fleet of **10 drones**. A drone is capable of carrying devices, other than
cameras, and capable of delivering small loads. For our use case **the load is
medications**.
A **Drone** has:
- serial number (100 characters max);
- model (Lightweight, Middleweight, Cruiserweight, Heavyweight);
- weight limit (500gr max);
- battery capacity (percentage);
- state (IDLE, LOADING, LOADED, DELIVERING, DELIVERED, RETURNING).
Each **Medication** has:
- name (allowed only letters, numbers, '-', '_');
- weight;
- code (allowed only upper case letters, underscore and numbers);
- image (picture of the medication case).

Develop a service via REST API that allows clients to communicate with the drones (i.e.
**dispatch controller**). The specific communicaiton with the drone is outside the scope
of this task.

The service should allow:
- registering a drone;
- loading a drone with medication items;
- checking loaded medication items for a given drone;
- checking available drones for loading;
- check drone battery level for a given drone;
> Feel free to make assumptions for the design approach.

### Requirements
While implementing your solution **please take care of the following requirements**:
#### Functional requirements
- There is no need for UI;
- Prevent the drone from being loaded with more weight that it can carry;
- Prevent the drone from being in LOADING state if the battery level is **below 25%**;
- Introduce a periodic task to check drones battery levels and create history/audit event log for this.

#### Non-functional requirements
- Input/output data must be in JSON format;
- Your project must be build-able and runnable;
- Your project must have a README file with build/run/test instructions (use DB that can
be run locally, e.g. in-memory, via container);
- Required data must be preloaded in the database.
- Unit tests are optional but advisable (if you have time);
- Advice: Show us how you work through your commit history.
- Programming Language: (Node.js Typescript optional) or Java

### Installation Procedures
#### Clone the project
```bash
    git clone <this-repo-url>
```

#### install the packages from npm
```bash
    npm install
```

#### start the application
```bash
    npm start
```
The API will be available locally on port 3000. <br>

If the port is not available, the value can be changed via the port variable in the app.js file on line 5.
```node
  const port = 3000;
```

### Extra Additions
 - The audit log is triggered every 10 minutes.

 - When a drone is loaded, a background service simulates the drone moving to it's destination, dropping its payload and returning. While losing battery level constantly.

- A drone automatically charges once in an idle state (simulated by a background service).

### Postman link
The collection of endpoints for testing this API can be found [here](https://documenter.getpostman.com/view/16059391/2s93m63NtQ)