require('dotenv').config();
const { OpenAI } = require('openai');

const { OPENAI_API_KEY } = process.env;

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY
});

async function generateFoodReccomendation(foodHistory, menulisting, reccomendationHistory) {
    try {
        const completion = await openai.chat.completions.create({
        messages: [
            { 
            role: "system", 
            content: `Give me food recommendations based on the following food order history of this user ${foodHistory},
                    and also based on the past reccomendations ${reccomendationHistory}. 
                    Generate only 5 food suggestions for each food from the menu:
                      {
  "Bricklane": {
    "Fusion_Bowls": {
      "Grilled_Teriyaki_Chicken_Donburi": {
        "desc": "Rice bowl featuring grilled teriyaki chicken slices.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Bricklane/items/Grilled_Teriyaki_Chicken_Donburi.jpg",
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
        "price": 8
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
      "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Bricklane/logo/BricklaneLOGO.jpg"
    ],
    "menu_url": [
      "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Bricklane/menu/Bricklane1.png",
      "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Bricklane/menu/Bricklane2.png",
      "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Bricklane/menu/Bricklane3.png"
    ]
  },
  "Chops": {
    "Grilled_Meats": {
      "Beef_Steak": {
        "desc": "Grilled beef steak with a side of mashed potatoes and pepper sauce.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Chops/items/Beef_Steak.jpg",
        "price": 22
      },
      "Grilled_Chicken_Thighs": {
        "desc": "Herb-marinated chicken thighs grilled to perfection.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Chops/items/Grilled_Chicken_Thighs.jpg",
        "price": 12
      },
      "Grilled_Lamb_Chop": {
        "desc": "Juicy lamb chops marinated in rosemary and garlic, served with roasted vegetables.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Chops/items/Grilled_Lamb_Chop.jpg",
        "price": 18
      }
    },
    "Sides": {
      "Garlic_Butter_Mushrooms": {
        "desc": "SautÃ©ed mushrooms in garlic butter sauce.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Chops/items/Garlic_Butter_Mushrooms.jpg",
        "price": 6
      },
      "Truffle_Fries": {
        "desc": "Crispy fries tossed in truffle oil with parmesan cheese.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Chops/items/Truffle_Fries.jpg",
        "price": 8
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
  "Daijoubu": {
    "Curry": {
      "Chicken_Katsu_Don": {
        "desc": "Crispy chicken cutlet over rice.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Daijoubu/items/Chicken_Katsu_Don.jpg",
        "price": 10.5
      },
      "Curry_Katsu_Don": {
        "desc": "Breaded and fried pork cutlet served over rice with rich Japanese curry.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Daijoubu/items/Curry_Katsu_Don.jpg",
        "price": 11.9
      },
      "Unagi_Don": {
        "desc": "Grilled eel over sushi rice.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Daijoubu/items/Unagi_Don.jpg",
        "price": 15
      }
    },
    "Noodles": {
      "Shoyu_Ramen": {
        "desc": "Soy-based broth with chashu pork.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Daijoubu/items/Shoyu_Ramen.jpg",
        "price": 10.5
      },
      "Tempura_Udon": {
        "desc": "Thick noodles with shrimp tempura.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Daijoubu/items/Tempura_Udon.jpg",
        "price": 9
      },
      "Yakisoba": {
        "desc": "Stir-fried noodles with vegetables and pork.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Daijoubu/items/Yakisoba.jpg",
        "price": 8.5
      }
    },
    "Pasta": {
      "Mentaiko_Cream_Pasta": {
        "desc": "Creamy pasta tossed in mentaiko (cod roe) sauce, topped with tempura bits, bonito flakes, ebiko, and an onsen egg.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Daijoubu/items/Mentaiko_Cream_Pasta.jpg",
        "price": 9.9
      }
    },
    "Snacks": {
      "Edamame": {
        "desc": "Steamed soybeans sprinkled with sea salt.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Daijoubu/items/Edamame.jpg",
        "price": 4
      },
      "Katsu_Sando": {
        "desc": "Tonkatsu sandwich with cabbage slaw.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Daijoubu/items/Katsu_Sando.jpg",
        "price": 8
      },
      "Mentaiko_Fries": {
        "desc": "Crispy fries drizzled generously with savory mentaiko sauce.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Daijoubu/items/Mentaiko_Fries.jpg",
        "price": 7.5
      },
      "Takoyaki": {
        "desc": "Octopus-filled batter balls with mayo.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Daijoubu/items/Takoyaki.jpg",
        "price": 6.8
      }
    },
    "logo_url": [
      "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Daijoubu/logo/DaijoubuLOGO.png"
    ],
    "menu_url": [
      "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Daijoubu/menu/Daijoubu1.jpg",
      "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Daijoubu/menu/Daijoubu2.jpg"
    ]
  },
  "Ima_Sushi": {
    "Donburi": {
      "Kaisen_Chirashi_Don": {
        "desc": "A bowl of vinegared rice topped with a variety of fresh sashimi slices.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Ima_Sushi/items/Kaisen_Chirashi_Don.jpg",
        "price": 17.5
      },
      "Unagi_Don": {
        "desc": "Grilled eel over sushi rice.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Ima_Sushi/items/Unagi_Don.jpg",
        "price": 15
      }
    },
    "Snacks": {
      "Edamame": {
        "desc": "Steamed soybeans sprinkled with sea salt.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Ima_Sushi/items/Edamame.jpg",
        "price": 4
      },
      "Tako_Sunomono": {
        "desc": "Marinated octopus salad with cucumber and vinegar dressing.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Ima_Sushi/items/Tako_Sunomono.jpg",
        "price": 6
      }
    },
    "Sushi": {
      "Chirashi_Sushi": {
        "desc": "Assorted sashimi on vinegared rice.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Ima_Sushi/items/Chirashi_Sushi.jpg",
        "price": 16
      },
      "SMU_Dragon_Roll": {
        "desc": "Six-piece sushi roll featuring unagi, avocado, and ebi tempura.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Ima_Sushi/items/SMU_Dragon_Roll.jpg",
        "price": 13.5
      },
      "Salmon_Sushi": {
        "desc": "Fresh salmon slice over vinegared rice; special price for SMU students and staff.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Ima_Sushi/items/Salmon_Sushi.jpg",
        "price": 1.9
      }
    },
    "logo_url": [
      "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Ima_Sushi/logo/Ima_SushiLOGO.jpg"
    ],
    "menu_url": [
      "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Ima_Sushi/menu/Ima_Sushi1.jpg"
    ]
  },
  "Khoon_Coffeehouse_Express": {
    "Bread": {
      "Honey_Butter_Yaowarat_Bun": {
        "desc": "Fluffy bun infused with sweet honey butter.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Khoon_Coffeehouse_Express/items/Honey_Butter_Yaowarat_Bun.jpg",
        "price": 2.4
      },
      "Lotus_Biscoff_Yaowarat_Bun": {
        "desc": "Soft Thai-style bun filled with creamy Lotus Biscoff spread.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Khoon_Coffeehouse_Express/items/Lotus_Biscoff_Yaowarat_Bun.jpg",
        "price": 2.5
      }
    },
    "Curry": {
      "Green_Curry_Chicken": {
        "desc": "Coconut milk curry with bamboo shoots.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Khoon_Coffeehouse_Express/items/Green_Curry_Chicken.jpg",
        "price": 7
      },
      "Massaman_Curry": {
        "desc": "Rich and mild curry with potatoes and beef.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Khoon_Coffeehouse_Express/items/Massaman_Curry.jpg",
        "price": 8
      },
      "Tom_Yum_Goong": {
        "desc": "Hot-and-sour shrimp soup.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Khoon_Coffeehouse_Express/items/Tom_Yum_Goong.jpg",
        "price": 7.5
      }
    },
    "Noodles": {
      "Khao_Soi": {
        "desc": "Northern Thai curry noodle soup with crispy egg noodles.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Khoon_Coffeehouse_Express/items/Khao_Soi.jpg",
        "price": 7
      },
      "Pad_Thai": {
        "desc": "Stir-fried rice noodles with peanuts.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Khoon_Coffeehouse_Express/items/Pad_Thai.jpg",
        "price": 6.5
      }
    },
    "Rice": {
      "Thai_Basil_Chicken_Rice": {
        "desc": "Spicy chicken with jasmine rice.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Khoon_Coffeehouse_Express/items/Thai_Basil_Chicken_Rice.jpg",
        "price": 6
      },
      "Tomato_Seafood_Baked_Rice_Set": {
        "desc": "Baked rice in tangy tomato sauce with prawns and scallops, served with a complimentary drink.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Khoon_Coffeehouse_Express/items/Tomato_Seafood_Baked_Rice_Set.jpg",
        "price": 6.5
      }
    },
    "Waffles": {
      "Caramel": {
        "desc": "A rich and buttery caramel drizzle, perfect for those who love a sweet and slightly salty flavor",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Khoon_Coffeehouse_Express/items/Caramel.jpg",
        "price": 3
      },
      "Chocolate": {
        "desc": "A classic choice with smooth, velvety chocolate topping for all the chocolate lovers",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Khoon_Coffeehouse_Express/items/Chocolate.jpg",
        "price": 2
      },
      "Peanut": {
        "desc": "A crunchy and nutty option, adding a savory twist to your waffles",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Khoon_Coffeehouse_Express/items/Peanut.jpg",
        "price": 2
      }
    },
    "logo_url": [
      "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Khoon_Coffeehouse_Express/logo/Khoon_Coffeehouse_ExpressLOGO.jpg"
    ],
    "menu_url": [
      "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Khoon_Coffeehouse_Express/menu/Khoon_Coffeehouse_Express1.png",
      "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Khoon_Coffeehouse_Express/menu/Khoon_Coffeehouse_Express2.png"
    ]
  },
  "King_Kong_Curry": {
    "Curry": {
      "Cheese_Curry_Rice": {
        "desc": "Japanese curry rice topped with melted cheese.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/King_Kong_Curry/items/Cheese_Curry_Rice.jpg",
        "price": 9.8
      },
      "Chicken_Katsu_Curry": {
        "desc": "Crispy breaded chicken cutlet with Japanese curry over rice.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/King_Kong_Curry/items/Chicken_Katsu_Curry.jpg",
        "price": 11.5
      },
      "Karaage_Curry_Rice": {
        "desc": "Japanese-style fried chicken served with curry over rice.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/King_Kong_Curry/items/Karaage_Curry_Rice.jpg",
        "price": 10.8
      },
      "Omelette_Curry_Rice": {
        "desc": "Fluffy Japanese omelette served with curry rice.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/King_Kong_Curry/items/Omelette_Curry_Rice.jpg",
        "price": 9.5
      },
      "Pork_Katsu_Curry": {
        "desc": "Breaded pork cutlet served with thick Japanese curry.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/King_Kong_Curry/items/Pork_Katsu_Curry.jpg",
        "price": 12.3
      },
      "Seafood_Curry_Rice": {
        "desc": "Japanese curry served with fried prawns, squid, and fish fillet.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/King_Kong_Curry/items/Seafood_Curry_Rice.jpg",
        "price": 12.5
      },
      "Signature_King_Kong_Curry": {
        "desc": "Rich Japanese curry served with your choice of katsu, beef, or vegetables.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/King_Kong_Curry/items/Signature_King_Kong_Curry.jpg",
        "price": 10.5
      },
      "Spicy_Curry_Rice": {
        "desc": "A bolder, spicier version of our traditional Japanese curry.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/King_Kong_Curry/items/Spicy_Curry_Rice.jpg",
        "price": 10
      },
      "Vegetarian_Curry": {
        "desc": "A plant-based Japanese curry featuring tofu and seasonal vegetables.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/King_Kong_Curry/items/Vegetarian_Curry.jpg",
        "price": 8.9
      },
      "Wagyu_Beef_Curry": {
        "desc": "Premium Wagyu beef slices served with Japanese curry over rice.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/King_Kong_Curry/items/Wagyu_Beef_Curry.jpg",
        "price": 16.9
      }
    },
    "logo_url": [
      "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/King_Kong_Curry/logo/King_Kong_CurryLOGO.jpg"
    ],
    "menu_url": [
      "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/King_Kong_Curry/menu/King_Kong_Curry1.png"
    ]
  },
  "Kuro_Kare": {
    "Curry": {
      "Black_Angus_Shortribs_Curry": {
        "desc": "Tender Black Angus short ribs paired with flavorful Japanese curry and rice.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Kuro_Kare/items/Black_Angus_Shortribs_Curry.jpg",
        "price": 16.9
      },
      "Curry_Udon": {
        "desc": "Udon noodles in curry broth.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Kuro_Kare/items/Curry_Udon.jpg",
        "price": 10
      },
      "Tori_Katsu_Curry": {
        "desc": "Breaded chicken cutlet served with rich Japanese curry over rice.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Kuro_Kare/items/Tori_Katsu_Curry.jpg",
        "price": 11.9
      },
      "Vegetable_Katsu_Curry": {
        "desc": "Fried veggies with thick curry.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Kuro_Kare/items/Vegetable_Katsu_Curry.jpg",
        "price": 10.5
      }
    },
    "Set_Meals": {
      "Set_Meal_Add_on": {
        "desc": "Includes a drink and chicken bone broth soup simmered for over six hours.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Kuro_Kare/items/Set_Meal_Add_on.jpg",
        "price": 3.9
      }
    },
    "logo_url": [
      "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Kuro_Kare/logo/Kuro_KareLOGO.jpg"
    ],
    "menu_url": [
      "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Kuro_Kare/menu/Kuro_Kare1.jpg"
    ]
  },
  "Nasi_Lemak_Ayam_Taliwang": {
    "Chicken_Dishes": {
      "Ayam_Bakar": {
        "desc": "Grilled chicken with sweet soy glaze.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Nasi_Lemak_Ayam_Taliwang/items/Ayam_Bakar.jpg",
        "price": 7.2
      },
      "Ayam_Penyet": {
        "desc": "Smashed fried chicken with sambal and rice.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Nasi_Lemak_Ayam_Taliwang/items/Ayam_Penyet.jpg",
        "price": 7
      },
      "Nasi_Lemak_Ayam_Taliwang": {
        "desc": "Signature nasi lemak featuring grilled chicken marinated in traditional Ayam Taliwang spices, served with fragrant coconut rice and accompaniments.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Nasi_Lemak_Ayam_Taliwang/items/Nasi_Lemak_Ayam_Taliwang.jpg",
        "price": 6.5
      },
      "Soto_Ayam": {
        "desc": "Spicy turmeric chicken soup with rice.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Nasi_Lemak_Ayam_Taliwang/items/Soto_Ayam.jpg",
        "price": 6.5
      }
    },
    "Curry": {
      "Rendang": {
        "desc": "Slow-cooked beef in coconut milk curry.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Nasi_Lemak_Ayam_Taliwang/items/Rendang.jpg",
        "price": 8.5
      }
    },
    "Noodles": {
      "Bakso": {
        "desc": "Beef meatball soup with noodles.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Nasi_Lemak_Ayam_Taliwang/items/Bakso.jpg",
        "price": 6
      },
      "Mie_Goreng": {
        "desc": "Indonesian fried noodles with egg and vegetables.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Nasi_Lemak_Ayam_Taliwang/items/Mie_Goreng.jpg",
        "price": 5.8
      }
    },
    "Rice": {
      "Lontong_Sayur": {
        "desc": "Compressed rice cakes served with vegetable curry.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Nasi_Lemak_Ayam_Taliwang/items/Lontong_Sayur.jpg",
        "price": 5.5
      },
      "Nasi_Goreng": {
        "desc": "Fried rice with shrimp paste and chili.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Nasi_Lemak_Ayam_Taliwang/items/Nasi_Goreng.jpg",
        "price": 6.3
      }
    },
    "Vegetarian": {
      "Gado_Gado": {
        "desc": "Boiled vegetables with peanut sauce.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Nasi_Lemak_Ayam_Taliwang/items/Gado_Gado.jpg",
        "price": 5.5
      },
      "Tempeh_Goreng": {
        "desc": "Fried tempeh served with spicy sambal.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Nasi_Lemak_Ayam_Taliwang/items/Tempeh_Goreng.jpg",
        "price": 4.5
      }
    },
    "logo_url": [
      "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Nasi_Lemak_Ayam_Taliwang/logo/Nasi_Lemak_Ayam_TaliwangLOGO.jpg"
    ],
    "menu_url": [
      "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Nasi_Lemak_Ayam_Taliwang/menu/Nasi_Lemak_Ayam_Taliwang1.jpg"
    ]
  },
  "ONALU_Bagel_Haus": {
    "Bagel": {
      "Hash_Stack_Bagel": {
        "desc": "Bagel sandwich with hashbrown, scrambled eggs, and house-made jam.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/ONALU_Bagel_Haus/items/Hash_Stack_Bagel.jpg",
        "price": 8
      },
      "Kaya_Thyme_Bagel": {
        "desc": "A unique twist on traditional kaya toast, featuring kaya and thyme.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/ONALU_Bagel_Haus/items/Kaya_Thyme_Bagel.jpg",
        "price": 9
      },
      "Somethin_Fishy_Bagel": {
        "desc": "Bagel filled with Norwegian smoked salmon, scallion cream cheese, and capers.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/ONALU_Bagel_Haus/items/Somethin_Fishy_Bagel.jpg",
        "price": 12
      }
    },
    "logo_url": [
      "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/ONALU_Bagel_Haus/logo/ONALU_Bagel_HausLOGO.jpg"
    ],
    "menu_url": [
      "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/ONALU_Bagel_Haus/menu/ONALU_Bagel_Haus1.jpg"
    ]
  },
  "Park_s_Kitchen": {
    "BBQ": {
      "Bibimbap": {
        "desc": "Mixed rice with assorted vegetables and your choice of protein, topped with a fried egg and served with kimchi.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Park_s_Kitchen/items/Bibimbap.jpg",
        "price": 4
      },
      "Bulgogi": {
        "desc": "Marinated beef BBQ with rice.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Park_s_Kitchen/items/Bulgogi.jpg",
        "price": 8.5
      },
      "Spicy_Pork_Rice_Bowl": {
        "desc": "Rice bowl topped with spicy marinated pork slices and a fried egg, accompanied by kimchi.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Park_s_Kitchen/items/Spicy_Pork_Rice_Bowl.jpg",
        "price": 6.8
      }
    },
    "Noodles": {
      "Japchae": {
        "desc": "Stir-fried glass noodles with veggies.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Park_s_Kitchen/items/Japchae.jpg",
        "price": 6.5
      },
      "Ramyun": {
        "desc": "Korean instant noodles with vegetables and egg.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Park_s_Kitchen/items/Ramyun.jpg",
        "price": 5.5
      }
    },
    "Stews": {
      "Kimchi_Jjigae": {
        "desc": "Kimchi stew with tofu and pork.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Park_s_Kitchen/items/Kimchi_Jjigae.jpg",
        "price": 7
      }
    },
    "logo_url": [
      "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Park_s_Kitchen/logo/Park_s_KitchenLOGO.jpg"
    ],
    "menu_url": [
      "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Park_s_Kitchen/menu/Park_s_Kitchen1.jpg"
    ]
  },
  "Pasta_Express": {
    "Extras": {
      "Caesar_Salad": {
        "desc": "Romaine lettuce, croutons, parmesan, and Caesar dressing.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Pasta_Express/items/Caesar_Salad.jpg",
        "price": 5
      },
      "Garlic_Bread": {
        "desc": "Buttery toasted bread with garlic and parsley.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Pasta_Express/items/Garlic_Bread.jpg",
        "price": 3.5
      }
    },
    "Pasta": {
      "Customizable_Pasta_Base": {
        "desc": "Choose from Tomato Sauce, Cream Sauce, or Aglio Olio as your pasta base.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Pasta_Express/items/Customizable_Pasta_Base.jpg",
        "price": 3.8
      },
      "Spaghetti_Aglio_Olio": {
        "desc": "Garlic and olive oil pasta with chili flakes.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Pasta_Express/items/Spaghetti_Aglio_Olio.jpg",
        "price": 6
      }
    },
    "Toppins": {
      "Meat_Toppings": {
        "desc": "Add-ons like minced beef, pepperoni, or smoked duck breast to enhance your pasta.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Pasta_Express/items/Meat_Toppings.jpg",
        "price": 1.4
      },
      "Vegetable_Toppings": {
        "desc": "Options include sweet corn, sous vide egg, and spinach to complement your dish.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Pasta_Express/items/Vegetable_Toppings.jpg",
        "price": 0.8
      }
    },
    "logo_url": [
      "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Pasta_Express/logo/Pasta_ExpressLOGO.jpg"
    ],
    "menu_url": [
      "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Pasta_Express/menu/Pasta_Express1.jpg"
    ]
  },
  "Supergreen": {
    "Bowls": {
      "Grilled_Salmon_Bowl": {
        "desc": "Salmon, brown rice, avocado.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Supergreen/items/Grilled_Salmon_Bowl.jpg",
        "price": 9
      },
      "Quinoa_Salad_Bowl": {
        "desc": "Kale, quinoa, roasted veggies.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Supergreen/items/Quinoa_Salad_Bowl.jpg",
        "price": 8.5
      },
      "Teriyaki_Chicken_Rice": {
        "desc": "Organic brown rice topped with teriyaki chicken thigh, sweet corn, green pepper, and a hard-boiled egg.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Supergreen/items/Teriyaki_Chicken_Rice.jpg",
        "price": 7.2
      },
      "Vegan_Buddha_Bowl": {
        "desc": "Mixed greens, chickpeas, roasted sweet potato, tahini dressing.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Supergreen/items/Vegan_Buddha_Bowl.jpg",
        "price": 8
      }
    },
    "Extras": {
      "Avocado_Tomato_Salad": {
        "desc": "Fresh avocado, cherry tomatoes, olive oil, and balsamic glaze.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Supergreen/items/Avocado_Tomato_Salad.jpg",
        "price": 6
      },
      "Grilled_Veggie_Wrap": {
        "desc": "Whole wheat wrap with grilled zucchini, bell peppers, and hummus.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Supergreen/items/Grilled_Veggie_Wrap.jpg",
        "price": 6.5
      },
      "Protein_Shake": {
        "desc": "Blended protein shake with almond milk and berries.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Supergreen/items/Protein_Shake.jpg",
        "price": 5
      }
    },
    "Pasta": {
      "Smoked_Duck_Pasta": {
        "desc": "Organic fusilli pasta with seasoned smoked duck, cherry tomatoes, sautÃ©ed mushrooms, and Japanese cucumber.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Supergreen/items/Smoked_Duck_Pasta.jpg",
        "price": 8
      },
      "Spaghetti_Carbonara": {
        "desc": "Pancetta, egg, and pecorino.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Supergreen/items/Spaghetti_Carbonara.jpg",
        "price": 7.8
      },
      "Zucchini_Noodles_with_Pesto": {
        "desc": "Low-carb zucchini noodles with basil pesto.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Supergreen/items/Zucchini_Noodles_with_Pesto.jpg",
        "price": 7.5
      }
    },
    "logo_url": [
      "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Supergreen/logo/SupergreenLOGO.jpg"
    ],
    "menu_url": [
      "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Supergreen/menu/Supergreen1.png"
    ]
  },
  "Turks_Kebab": {
    "Kebabs": {
      "Chicken_Shish_Kebab": {
        "desc": "Grilled chicken skewers marinated in Turkish spices, served with rice and salad.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Turks_Kebab/items/Chicken_Shish_Kebab.jpg",
        "price": 10
      },
      "Lamb_Doner_Kebab": {
        "desc": "Thinly sliced lamb doner wrapped in flatbread with lettuce, tomatoes, and yogurt sauce.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Turks_Kebab/items/Lamb_Doner_Kebab.jpg",
        "price": 9
      },
      "Mixed_Grill_Platter": {
        "desc": "A platter of grilled chicken, lamb, and beef kebabs with sides.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Turks_Kebab/items/Mixed_Grill_Platter.jpg",
        "price": 18
      }
    },
    "Sides": {
      "Hummus": {
        "desc": "Creamy chickpea dip served with pita bread.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Turks_Kebab/items/Hummus.jpg",
        "price": 5
      },
      "Tabbouleh": {
        "desc": "Fresh parsley salad with bulgur, tomatoes, and lemon dressing.",
        "photo": "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Turks_Kebab/items/Tabbouleh.jpg",
        "price": 6
      }
    },
    "logo_url": [
      "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Turks_Kebab/logo/Turks_KebabLOGO.jpg"
    ],
    "menu_url": [
      "https://storage.googleapis.com/menu-b8c1f.firebasestorage.app/Turks_Kebab/menu/Turks_Kebab1.jpg"
    ]
  }
}
                    
                    and make sure the items you suggest has to come from a restaurant that exist inside the menu.
                    Returnin valid JSON format in the below example and the food suggestions can come from various restaurants as long as total there are 5 suggestions. 
                    Here is a sample example output:
                    {
                      "foodReccomendation": {
                        "suggestion1": {
                          "desc": "Smashed fried chicken with sambal and rice.",
                          "food_item": "Grilled_Teriyaki_Chicken_Donburi",
                          "price": "$7.00",
                          "restaurant": "Bricklane",
                          "photo": "url"
                        },
                        "suggestion2": {
                          "desc": "Indonesian fried noodles with egg and vegetables.",
                          "food_item": "Chicken_Katsu_Don",
                          "price": "$5.80",
                          "restaurant": "Daijoubu",
                          "photo": "url"
                        },
                        "suggestion3": {
                          "desc": "Fried rice with shrimp paste and chili.",
                          "food_item": "Honey_Butter_Yaowarat_Bun",
                          "price": "$6.30",
                          "restaurant": "Khoon_Coffeehouse_Express",
                          "photo": "url"
                        },
                        "suggestion4": {
                          "desc": "Signature nasi lemak featuring grilled chicken marinated in traditional Ayam Taliwang spices, served with fragrant coconut rice and accompaniments.",
                          "food_item": "Omelette_Curry_Rice",
                          "price": "$6.50",
                          "restaurant": "King_Kong_Curry",
                          "photo": "url"
                        },
                        "suggestion5": {
                          "desc": "Beef meatball soup with noodles.",
                          "food_item": "Hash_Stack_Bagel",
                          "price": "$6.00",
                          "restaurant": "ONALU_Bagel_Haus",
                          "photo": "url"
                        }
                      },
                      "message": "Food Reccomendation given successfully!"
                    }`
            }
        ],
        model: "gpt-3.5-turbo",
        });

        const responseContent = completion.choices[0].message.content;
        console.log(responseContent);
        const parsedContent = JSON.parse(responseContent);
        return parsedContent;
    } catch (error) {
        console.error('Error generating food reccomendation:', error);
        throw error;
    }
}

module.exports = {
    generateFoodReccomendation, 
};






