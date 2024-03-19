#!/usr/bin/env node

import inquirer from "inquirer";
import select from '@inquirer/select'
import qr from "qr-image"
import fs from "fs"

const getUserInput = async () => {
    const url = await inquirer.prompt([{
        message: "Please enter your link to generate a QR code:",
        name: 'URL'
    }]) 
    const fileName = await inquirer.prompt([{
        message: "Please enter a file name for your new QR Code:",
        name: 'fileName'
    }]) 
    const fileType = await select({
        message: "Please select a file type for your QR Code:",
        choices: [
            {
                name: "png",
                value: "png"
            },
            {
                name: "svg",
                value: "svg"
            },
            {
                name: "pdf",
                value: "pdf"
            },
            {
                name: "eps",
                value: "eps"
            }

        ]
    })
    
    return {...url, ...fileName, type: fileType}
}

const createQR = async () => {
    const userInput = await getUserInput();
    const {URL, fileName, type} = userInput

    const QR = qr.image(URL, {...type})

    QR.pipe(fs.createWriteStream(`${fileName}.${type}`))
    fs.writeFile(`${fileName}.txt`, JSON.stringify(userInput), (error)=>{
        if(error) throw error
        try {
            console.log("The file has been saved!");
        }
        catch (error){
            console.error(error)
        }
    })
}

createQR()