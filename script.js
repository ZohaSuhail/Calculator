const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


let password = "";
let passwordLength = 10;
let CheckCount = 0;
handleSlider();
setIndicator("#ccc");


function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max - min)) + "% 100%";
}



function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxshadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function generateRandomNumber() {
    return getRndInteger(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
    const random = getRndInteger(0, symbols.length);
    return symbols.charAt(random);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNumber = true;
    if (symbolsCheck.checked) hasSymbol = true;

    if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
        setIndicator("#0f0");
    }
    else if ((hasLower || hasUpper) && (hasNumber || hasSymbol) && passwordLength >= 6) {
        setIndicator("#ff0");
    }
    else {
        setIndicator("#f00");
    }
}
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch (e) {
        copyMsg.innerText = "Failed";
    }

    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);

}
function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange() {
    CheckCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked)
            CheckCount++;
    });

    if (passwordLength < CheckCount) {
        passwordLength = CheckCount;
        handleSlider();
    }

}
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value)
        copyContent();
});

generateBtn.addEventListener('click', () => {
    if (CheckCount == 0)
        return;

    if (passwordLength < CheckCount) {

        passwordLength = CheckCount;
        handleSlider();
    }

    password = "";

    // if (uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }
    // if (lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }
    // if (numbersCheck.checked) {
    //     password += generateRandomNumber();
    // }
    // if (symbolsCheck.checked) {
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if (uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if (lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if (numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if (symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsory addition
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("COmpulsory adddition done");

    //remaining adddition
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRndInteger(0, funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining adddition done");
    //shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");
    //show in UI
    passwordDisplay.value = password;
    console.log("UI adddition done");
    //calculate strength
    calcStrength();
});