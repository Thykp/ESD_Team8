## Instructions
```bash
go run main.go
```

> Health Check

GET http://localhost:8080

Sample Output:
```bash
"message": "Hello, World! Gin server is running 🚀",
```

> Get user order

GET http://localhost:8080/order/id

where id = user id

Sample Output:
```json
[
    {
        "order_id": "4631fe98-2fa6-4da5-b695-7eeb6328715a",
        "user_id": "Kendrick",
        "info": {
        "items": [
            {
                "qty": 2,
                "dish": "Grilled_Teriyaki_Chicken_Donburi",
                "price": 13.8
            },
            {
                "qty": 200,
                "dish": "Bulgogi_Tacos",
                "price": 1600
            }
        ]
        },
        "status": "processing",
        "restaurant": "Bricklane",
        "total": 1613.8
    },
    {
        "order_id": "c9ba07bb-7b45-40e3-9643-2a276d331e26",
        "user_id": "Kendrick",
        "info": {
        "items": [
            {
                "qty": 1,
                "dish": "Ayam_Penyet",
                "price": 7
            }
        ]
        },
        "status": "processing",
        "restaurant": "Nasi_Lemak_Ayam_Taliwang",
        "total": 49
    }
]
```


> Get user reccomendation

GET http://localhost:8080/reccomendation/id

where id = user id

Sample Output:
```json
{
  "food": {
    "Restaurant": "Ayam Taliwang",
    "Dish": "Chicken Rice"
  }
}
```

> Get all Menu items

GET http://localhost:8080/menu

Sample Output:
```json
{
    "Bricklane": { // store name
        "Fusion_Bowls": { //category of the item
            "Grilled_Teriyaki_Chicken_Donburi": { // item itself
                "desc": "Rice bowl featuring grilled teriyaki chicken slices.", // description of the item
                "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Bricklane/items/Grilled_Teriyaki_Chicken_Donburi.jpg", // photo url of the item
                "price": 6.9
            },
            "Kimchi_Carbonara": {
                "desc": "Spicy kimchi + creamy pasta.",
                "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Bricklane/items/Kimchi_Carbonara.jpg",
                "price": 9.5
            },
            "Torched_NZ_Ribeye_Beef_Cubes_Donburi": {
                "desc": "Rice bowl topped with torched New Zealand ribeye beef cubes.",
                "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Bricklane/items/Torched_NZ_Ribeye_Beef_Cubes_Donburi.jpg",
                "price": 10.9
            }
        },
        "Snacks": {
            "Bulgogi_Tacos": {
                "desc": "Korean beef in crispy tacos.",
                "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Bricklane/items/Bulgogi_Tacos.jpg",
                "price": 8.0
            },
            "Korean_Fried_Chicken": { 
                "desc": "Crispy fried chicken with spicy gochujang glaze.", 
                "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Bricklane/items/Korean_Fried_Chicken.jpg", 
                "price": 7.5
            },
            "Torched_Mentaiko_Fries": {
                "desc": "Fries topped with torched mentaiko sauce, ideal for sharing.",
                "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Bricklane/items/Torched_Mentaiko_Fries.jpg",
                "price": 8.9
            }
        },
        "logo_url": [
            "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Bricklane/logo/BricklaneLOGO.jpg" // logo url to be used on the clickable icon
        ],
        "menu_url": [
            "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Bricklane/menu/Bricklane1.png", // menu picture url to be used to display picture of the menu
            "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Bricklane/menu/Bricklane2.png",
            "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Bricklane/menu/Bricklane3.png"
        ]
    },
    "Chops": {
        "Grilled_Meats": {
            "Beef_Steak": {
                "desc": "Grilled beef steak with a side of mashed potatoes and pepper sauce.",
                "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Chops/items/Beef_Steak.jpg",
                "price": 22.0
            },
            "Grilled_Chicken_Thighs": {
                "desc": "Herb-marinated chicken thighs grilled to perfection.",
                "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Chops/items/Grilled_Chicken_Thighs.jpg",
                "price": 12.0
            },
            "Grilled_Lamb_Chop": {
                "desc": "Juicy lamb chops marinated in rosemary and garlic, served with roasted vegetables.",
                "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Chops/items/Grilled_Lamb_Chop.jpg",
                "price": 18.0
            }
        },
        "Sides": {
            "Garlic_Butter_Mushrooms": {
                "desc": "SautÃ©ed mushrooms in garlic butter sauce.",
                "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Chops/items/Garlic_Butter_Mushrooms.jpg",
                "price": 6.0
            },
            "Truffle_Fries": {
                "desc": "Crispy fries tossed in truffle oil with parmesan cheese.",
                "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Chops/items/Truffle_Fries.jpg",
                "price": 8.0
            }
        },
        "logo_url": [
            "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Chops/logo/ChopsLOGO.jpg"
        ],
        "menu_url": [
            "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Chops/menu/Chops1.jpg",
            "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Chops/menu/Chops2.jpg",
            "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Chops/menu/Chops3.jpg"
        ]
    },
    // continued ...
}
```

> Prompt Chatgpt for reccomendations

POST http://localhost:8080/chatgpt/id

where id = user id

Sample Output:
```json
{
    "foodReccomendation": {
        "suggestion1": {
            "category": "Chicken Dishes",
            "desc": "Smashed fried chicken with sambal and rice.",
            "food_item": "Ayam Penyet",
            "price": "$7.00",
            "restaurant": "Nasi Lemak Ayam Taliwang"
        },
        "suggestion2": {
            "category": "Noodles_and_Rice",
            "desc": "Indonesian fried noodles with egg and vegetables.",
            "food_item": "Mie Goreng",
            "price": "$5.80",
            "restaurant": "Nasi Lemak Ayam Taliwang"
        },
        "suggestion3": {
            "category": "Noodles_and_Rice",
            "desc": "Beef meatball soup with noodles.",
            "food_item": "Bakso",
            "price": "$6.00",
            "restaurant": "Nasi Lemak Ayam Taliwang"
        },
        "suggestion4": {
            "category": "Noodles_and_Rice",
            "desc": "Fried rice with shrimp paste and chili.",
            "food_item": "Nasi Goreng",
            "price": "$6.30",
            "restaurant": "Nasi Lemak Ayam Taliwang"
        },
        "suggestion5": {
            "category": "Chicken Dishes",
            "desc": "Signature nasi lemak featuring grilled chicken marinated in traditional Ayam Taliwang spices, served with fragrant coconut rice and accompaniments.",
            "food_item": "Nasi Lemak Ayam Taliwang",
            "price": "$6.50",
            "restaurant": "Nasi Lemak Ayam Taliwang"
        }
    },
    "message": "Food Reccomendation given successfully!"
}
```
