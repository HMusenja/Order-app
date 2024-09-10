import inquirer from 'inquirer';





// Sample menu with food, drinks, and desserts, along with prices in euros
var menu = {
    food: [
        { name: 'Pizza', price: 9.5 },
        { name: 'Burger', price: 7.5 },
        { name: 'Salad', price: 6 },
        { name: 'Pasta', price: 11.5 },
        { name: 'Sushi', price: 14 },
    ],
    drinks: [
        { name: 'Water', price: 1.5 },
        { name: 'Soda', price: 2.5 },
        { name: 'Wine', price: 6 },
        { name: 'Beer', price: 4.5 },
        { name: 'Juice', price: 3.5 },
    ],
    desserts: [
        { name: 'Ice Cream', price: 4 },
        { name: 'Cake', price: 5 },
        { name: 'Fruit Salad', price: 3.5 },
        { name: 'Brownie', price: 6 },
        { name: 'Mousse', price: 7 },
    ],
};

// Order storage for each table
var orders = [];

function takeOrderForTable() {
    var tableOrder = [];
    var totalPrice = 0;

    // Ask for the number of guests
    inquirer.prompt({
        type: 'number',
        name: 'guests',
        message: 'How many guests are at the table?',
    }).then(function(guestAnswer) {
        var guests = guestAnswer.guests;

        // Ask if they are ordering together or separately
        inquirer.prompt({
            type: 'confirm',
            name: 'together',
            message: 'Are you ordering together?',
        }).then(function(orderAnswer) {
            var together = orderAnswer.together;

            if (together) {
                // Group order
                processOrder(function(order, price) {
                    for (var i = 0; i < guests; i++) {
                        tableOrder.push(order); // Add the same order for each guest
                    }
                    totalPrice = price * guests; // Total price for all guests
                    displayOrderAndPrice(tableOrder, totalPrice);
                    askForAnotherTable();
                });
            } else {
                // Separate orders
                var individualOrders = [];
                var individualPrices = [];
                var totalGuests = 0;

                function processGuestOrder() {
                    if (totalGuests < guests) {
                        console.log(`Taking order for guest ${totalGuests + 1}`);
                        processOrder(function(order, price) {
                            individualOrders.push(order);
                            individualPrices.push(price);
                            totalGuests++;
                            processGuestOrder(); // Process the next guest's order
                        });
                    } else {
                        for (var j = 0; j < guests; j++) {
                            console.log(`Guest ${j + 1}'s order:`, individualOrders[j]);
                            console.log(`Guest ${j + 1}'s total price: €${individualPrices[j].toFixed(2)}`);
                            console.log('-----------------------------------');
                        }
                        askForAnotherTable();
                    }
                }

                processGuestOrder();
            }
        });
    });
}

function processOrder(callback) {
    var order = {};
    var totalPrice = 0;

    // Ask for food choice
    inquirer.prompt({
        type: 'list',
        name: 'foodChoice',
        message: 'What would you like to eat?',
        choices: menu.food.map(function(item) {
            return `${item.name} (€${item.price})`;
        }),
    }).then(function(foodAnswer) {
        var selectedFood = menu.food.find(function(item) {
            return `${item.name} (€${item.price})` === foodAnswer.foodChoice;
        });
        order.food = selectedFood.name;
        totalPrice += selectedFood.price;

        // Ask for drink choice
        inquirer.prompt({
            type: 'list',
            name: 'drinksChoice',
            message: 'What would you like to drink?',
            choices: menu.drinks.map(function(item) {
                return `${item.name} (€${item.price})`;
            }),
        }).then(function(drinkAnswer) {
            var selectedDrink = menu.drinks.find(function(item) {
                return `${item.name} (€${item.price})` === drinkAnswer.drinksChoice;
            });
            order.drinks = selectedDrink.name;
            totalPrice += selectedDrink.price;

            // Ask if they want dessert
            inquirer.prompt({
                type: 'confirm',
                name: 'dessertRequest',
                message: 'Would you like to order dessert?',
            }).then(function(dessertAnswer) {
                if (dessertAnswer.dessertRequest) {
                    inquirer.prompt({
                        type: 'list',
                        name: 'dessertChoice',
                        message: 'What dessert would you like?',
                        choices: menu.desserts.map(function(item) {
                            return `${item.name} (€${item.price})`;
                        }),
                    }).then(function(dessertChoiceAnswer) {
                        var selectedDessert = menu.desserts.find(function(item) {
                            return `${item.name} (€${item.price})` === dessertChoiceAnswer.dessertChoice;
                        });
                        order.desserts = selectedDessert.name;
                        totalPrice += selectedDessert.price;

                        callback(order, totalPrice);
                    });
                } else {
                    callback(order, totalPrice);
                }
            });
        });
    });
}

function displayOrderAndPrice(tableOrder, totalPrice) {
    console.log(`Table's order:`, tableOrder);
    console.log(`Total price for the table: €${totalPrice.toFixed(2)}`);
}

// Function to ask if there's another table to process
function askForAnotherTable() {
    inquirer.prompt({
        type: 'confirm',
        name: 'anotherTable',
        message: 'Is there another table to take an order for?',
    }).then(function(answer) {
        if (answer.anotherTable) {
            takeOrderForTable(); // Take orders for the next table
        } else {
            console.log('All orders completed. Thank you!');
            console.log('All orders:', orders);
        }
    });
}

// Start taking orders
takeOrderForTable();

