import inquirer from 'inquirer';

// Sample menu with food, drinks, and desserts, along with prices
const menu = {
    food: [
        { name: 'Pizza', price: 10 },
        { name: 'Burger', price: 8 },
        { name: 'Salad', price: 6 },
        { name: 'Pasta', price: 12 },
        { name: 'Sushi', price: 15 },
    ],
    drinks: [
        { name: 'Water', price: 2 },
        { name: 'Soda', price: 3 },
        { name: 'Wine', price: 7 },
        { name: 'Beer', price: 5 },
        { name: 'Juice', price: 4 },
    ],
    desserts: [
        { name: 'Ice Cream', price: 4 },
        { name: 'Cake', price: 5 },
        { name: 'Fruit Salad', price: 3 },
        { name: 'Brownie', price: 6 },
        { name: 'Mousse', price: 7 },
    ],
};

// Order storage for each table
let orders = [];

async function takeOrderForTable() {
    const tableOrder = [];
    let totalPrice = 0;

    // Ask for the number of guests
    const { guests } = await inquirer.prompt({
        type: 'number',
        name: 'guests',
        message: 'How many guests are at the table?',
    });

    // Ask if they are ordering together or separately
    const { together } = await inquirer.prompt({
        type: 'confirm',
        name: 'together',
        message: 'Are you ordering together?',
    });

    if (together) {
        // Group order
        const { order, price } = await processOrder(); // Get a full order
        for (let i = 0; i < guests; i++) {
            tableOrder.push(order); // Add the same order for each guest
        }
        totalPrice = price * guests; // Total price for all guests
    } else {
        // Separate orders
        for (let i = 0; i < guests; i++) {
            console.log(`Taking order for guest ${i + 1}`);
            const { order, price } = await processOrder(); // Get individual orders
            tableOrder.push(order);
            totalPrice += price; // Add price of each guest's order to the total
        }
    }

    orders.push({ tableOrder, totalPrice }); // Save the table's order
    console.log(`Table's order:`, tableOrder);
    console.log(`Total price for the table: $${totalPrice}`);
}

async function processOrder() {
    let order = {};
    let totalPrice = 0;

    // Ask for food choice
    const { foodChoice } = await inquirer.prompt({
        type: 'list',
        name: 'foodChoice',
        message: 'What would you like to eat?',
        choices: menu.food.map(item => item.name),
    });
    const selectedFood = menu.food.find(item => item.name === foodChoice);
    order.food = selectedFood.name;
    totalPrice += selectedFood.price;

    // Ask for drink choice
    const { drinksChoice } = await inquirer.prompt({
        type: 'list',
        name: 'drinksChoice',
        message: 'What would you like to drink?',
        choices: menu.drinks.map(item => item.name),
    });
    const selectedDrink = menu.drinks.find(item => item.name === drinksChoice);
    order.drinks = selectedDrink.name;
    totalPrice += selectedDrink.price;

    // Ask if they want dessert
    const { dessertRequest } = await inquirer.prompt({
        type: 'confirm',
        name: 'dessertRequest',
        message: 'Would you like to order dessert?',
    });

    if (dessertRequest) {
        const { dessertChoice } = await inquirer.prompt({
            type: 'list',
            name: 'dessertChoice',
            message: 'What dessert would you like?',
            choices: menu.desserts.map(item => item.name),
        });
        const selectedDessert = menu.desserts.find(item => item.name === dessertChoice);
        order.desserts = selectedDessert.name;
        totalPrice += selectedDessert.price;
    }

    return { order, price: totalPrice };
}

async function main() {
    let moreTables = true;

    while (moreTables) {
        await takeOrderForTable(); // Take orders for the current table

        // Check if there is another table to order
        const { anotherTable } = await inquirer.prompt({
            type: 'confirm',
            name: 'anotherTable',
            message: 'Is there another table?',
        });

        moreTables = anotherTable;
    }

    console.log('All orders:', orders);
    console.log('Thank you for your orders!');
}

main();
