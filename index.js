import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"


//The app's firebase config settings
const appSettings = {
    databaseURL: "https://playground-b83ca-default-rtdb.firebaseio.com/"
}


//Firebase database initialisations

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListDB = ref(database, 'shoppingList')


//Calling html elements
const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const cartListEl = document.getElementById("cart-list")


//Event listener for the Add to Cart button
addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    push(shoppingListDB, inputValue)
    
    // alert(`${inputValue} has successfully been added to your shopping list`)
    resetInputField()
})

inputFieldEl.addEventListener("keypress", (e) => {
    if (e.key == "Enter"){
        let inputValue = inputFieldEl.value
    push(shoppingListDB, inputValue)
    
    resetInputField()
    }
})


onValue(shoppingListDB, (snapshot) => {
    if(snapshot.exists()){
        let itemsArray = Object.entries(snapshot.val())
    
    
        clearCartList()

        for (let i = 0; i < itemsArray.length; i++) {
            renderCartList(itemsArray[i]);
        }  
    }
    else{
        cartListEl.innerHTML = "There are no more items left in your cart"
    }
    
})


//function to clear the shopping cart list
function clearCartList() {
    cartListEl.innerHTML = ''
}


//function to clear the input field after an entry is submited
function resetInputField() {
    inputFieldEl.value = ""
}


//function that appends the list items to the to the html/webpage
function renderCartList(item) {
    let itemId = item[0]
    let itemValue = item[1]

    let newListEl = document.createElement("li")

    newListEl.textContent = itemValue

    cartListEl.append(newListEl)

    newListEl.addEventListener("dblclick", () => {
        let itemLocationInDB = ref(database, `shoppingList/${itemId}`)
        remove(itemLocationInDB)
    })
}