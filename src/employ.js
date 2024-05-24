import Web3 from "web3"
import { infuraKey } from './account';
import abijson from "./EmployeeRegistry.json"
import { useState } from "react";

const providerURL = `https://sepolia.infura.io/v3/${infuraKey}`;
const contractAddress = "0x7e25d86Aab033d2F41062B3EE777fCeC437d8829"
const abi = abijson.abi;

const web3 = new Web3(new Web3.providers.HttpProvider(providerURL));
const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
const fromAccount = accounts[0];
console.log(fromAccount);

const employeeRegistry = new web3.eth.Contract(abi, contractAddress);

async function registerEmployee(employeeName, employeeId) {
    try {
        await employeeRegistry.methods.registerEmployee(employeeName, employeeId).send({ from: `${fromAccount}` });
        console.log("Employee registered successfully:", employeeName, employeeId);
    } catch (error) {
        console.error("Failed to register employee:", error);
    }
}

// Function to get employee information
async function getEmployee(employeeId) {
    try {
        const employee = await employeeRegistry.methods.getEmployee(employeeId).call();
        console.log("Employee information:", employee);
    } catch (error) {
        console.error("Failed to get employee information:", error);
    }
}

export default function Employ() {

    registerEmployee("Park", 123);

    return (
        <div>

        </div>
    )
}
