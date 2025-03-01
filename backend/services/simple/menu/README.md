## Instructions
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python api.py
```

To deactivate server:
```bash
deactivate
```

<h1>How to use</h1>

>To call all restraunts + photo of menu
>/all

<h3>Sample Output</h3>

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

<br>
<br>

>To call one restraunt
>/restraunt_name

<h3>Sample Output (/Bricklane)</h3>

```json
{
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
}
```

<br>
<br>
<h2>NOTE</h2> 
Ensure that any names should NOT have any spacings