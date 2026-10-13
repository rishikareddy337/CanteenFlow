package com.CanteenFlow.config;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.CanteenFlow.entity.FoodItem;
import com.CanteenFlow.entity.User;
import com.CanteenFlow.repository.FoodItemRepository;
import com.CanteenFlow.repository.UserRepository;

@Configuration
public class DataInitializer {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    public CommandLineRunner initData(FoodItemRepository foodItemRepository, UserRepository userRepository) {
        return args -> {
            // Seed Admin User
            if (userRepository.findByEmailIgnoreCase("admin@canteenflow.com").isEmpty()) {
                User admin = new User(
                        "Canteen Staff Admin",
                        "admin@canteenflow.com",
                        "admin123",
                        "9876543210",
                        "ADMIN"
                );
                userRepository.save(admin);
                log.info("Initialized default admin user: admin@canteenflow.com");
            }

            // Seed Food Items if table is empty
            if (foodItemRepository.count() == 0) {
                List<FoodItem> initialItems = List.of(
                        // Breakfast
                        new FoodItem(
                                "Masala Dosa",
                                "Crispy fermented crepe stuffed with spiced potato filling, served with coconut chutney & piping hot sambar.",
                                60.0,
                                "Breakfast",
                                "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop",
                                10,
                                true,
                                true
                        ),
                        new FoodItem(
                                "Idli Sambar (3 pcs)",
                                "Steamed fluffy rice cakes served with aromatic lentil sambar and fresh mint-coconut chutney.",
                                40.0,
                                "Breakfast",
                                "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop",
                                8,
                                true,
                                true
                        ),
                        new FoodItem(
                                "Crispy Medu Vada (2 pcs)",
                                "Golden-brown crunchy lentil fritters with soft interior, paired with fresh ginger chutney.",
                                35.0,
                                "Breakfast",
                                "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop",
                                8,
                                true,
                                true
                        ),
                        new FoodItem(
                                "Poori Bhaji (3 pcs)",
                                "Puffy golden wheat pooris served with savory spiced potato gravy and lemon pickle.",
                                50.0,
                                "Breakfast",
                                "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop",
                                12,
                                true,
                                true
                        ),
                        new FoodItem(
                                "Indori Poha",
                                "Flattened rice tempered with mustard seeds, turmeric, green chillies, curry leaves and roasted peanuts.",
                                35.0,
                                "Breakfast",
                                "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop",
                                8,
                                true,
                                true
                        ),
                        new FoodItem(
                                "Rava Upma",
                                "Traditional roasted semolina cooked with finely diced carrots, peas, cashews and ghee.",
                                35.0,
                                "Breakfast",
                                "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop",
                                8,
                                true,
                                true
                        ),

                        // Lunch
                        new FoodItem(
                                "Special Deluxe Veg Thali",
                                "Complete wholesome meal with Paneer curry, Dal Tadka, Seasonal Sabzi, 2 Rotis, Steamed Basmati Rice, Curd & Sweet.",
                                110.0,
                                "Lunch",
                                "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop",
                                15,
                                true,
                                true
                        ),
                        new FoodItem(
                                "Hyderabadi Chicken Biryani",
                                "Dum cooked fragrant long-grain basmati rice with tender spiced chicken pieces, served with mirchi ka salan and raita.",
                                140.0,
                                "Lunch",
                                "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop",
                                15,
                                true,
                                false
                        ),
                        new FoodItem(
                                "Paneer Butter Masala with Butter Naan",
                                "Cottage cheese cubes simmered in a velvety buttery tomato-cashew gravy with warm tandoor butter naan.",
                                130.0,
                                "Lunch",
                                "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop",
                                15,
                                true,
                                true
                        ),
                        new FoodItem(
                                "Veg Fried Rice with Manchurian",
                                "Wok-tossed vegetables and rice seasoned with oriental spices, served with crispy vegetable Manchurian balls in rich sauce.",
                                95.0,
                                "Lunch",
                                "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop",
                                12,
                                true,
                                true
                        ),
                        new FoodItem(
                                "Egg Fried Rice",
                                "Stir-fried basmati rice cooked on high flame with scrambled farm eggs, spring onions and savory seasoning.",
                                90.0,
                                "Lunch",
                                "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop",
                                12,
                                true,
                                false
                        ),
                        new FoodItem(
                                "Cooling Curd Rice",
                                "Creamy tempered yogurt rice with mustard seeds, curry leaves, pomegranate seeds and roasted cashews.",
                                50.0,
                                "Lunch",
                                "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop",
                                5,
                                true,
                                true
                        ),

                        // Snacks
                        new FoodItem(
                                "Crispy Punjabi Samosa (2 pcs)",
                                "Flaky deep-fried pastry triangles packed with spiced mashed potatoes, green peas and whole coriander, served with sweet & mint chutney.",
                                30.0,
                                "Snacks",
                                "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop",
                                5,
                                true,
                                true
                        ),
                        new FoodItem(
                                "Classic Veg Burger",
                                "Crispy spiced vegetable patty topped with melted cheese slice, lettuce, onions, juicy tomato and burger mayonnaise.",
                                75.0,
                                "Snacks",
                                "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop",
                                10,
                                true,
                                true
                        ),
                        new FoodItem(
                                "Peri Peri French Fries",
                                "Golden-brown crisp potato finger fries tossed generously in zesty and spicy peri-peri spice dust.",
                                65.0,
                                "Snacks",
                                "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop",
                                8,
                                true,
                                true
                        ),
                        new FoodItem(
                                "Paneer Tikka Roll",
                                "Smoky grilled marinated paneer chunks rolled in layered paratha with crisp mint onions and spicy green chutney.",
                                85.0,
                                "Snacks",
                                "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop",
                                10,
                                true,
                                true
                        ),
                        new FoodItem(
                                "Spicy Chicken Roll",
                                "Juicy pan-roasted shredded spiced chicken rolled inside egg-coated flaky flatbread with tangy sauces.",
                                110.0,
                                "Snacks",
                                "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop",
                                12,
                                true,
                                false
                        ),
                        new FoodItem(
                                "Steamed Veg Momos (6 pcs)",
                                "Delicate Himalayan flour dumplings stuffed with finely minced vegetables and spring herbs, served with fiery red dip.",
                                70.0,
                                "Snacks",
                                "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=600&auto=format&fit=crop",
                                10,
                                true,
                                true
                        ),

                        // Beverages
                        new FoodItem(
                                "Masala Cutting Chai",
                                "Traditional robust Indian milk tea brewed freshly with crushed cardamom, ginger and aromatic spices.",
                                15.0,
                                "Beverages",
                                "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop",
                                3,
                                true,
                                true
                        ),
                        new FoodItem(
                                "South Indian Filter Coffee",
                                "Frothy decoction filter coffee brewed in hot creamy milk, served fresh and aromatic.",
                                25.0,
                                "Beverages",
                                "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop",
                                4,
                                true,
                                true
                        ),
                        new FoodItem(
                                "Cold Coffee with Ice Cream",
                                "Chilled thick blended coffee shake crowned with a rich scoop of vanilla ice cream and chocolate drizzle.",
                                55.0,
                                "Beverages",
                                "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop",
                                5,
                                true,
                                true
                        ),
                        new FoodItem(
                                "Fresh Mint Lemonade Soda",
                                "Fizzy club soda infused with fresh squeezed lemon juice, crushed mint leaves, rock salt and cumin.",
                                35.0,
                                "Beverages",
                                "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop",
                                4,
                                true,
                                true
                        ),
                        new FoodItem(
                                "Thick Mango Lassi",
                                "Sweet churned whole milk yogurt blended with rich Alphonso mango pulp and saffron garnish.",
                                45.0,
                                "Beverages",
                                "https://images.unsplash.com/photo-1546173159-315724a31696?w=600&auto=format&fit=crop",
                                5,
                                true,
                                true
                        ),

                        // Desserts
                        new FoodItem(
                                "Warm Gulab Jamun (2 pcs)",
                                "Melt-in-mouth golden khoya dumplings soaked in fragrant rose and cardamom infused sugar syrup.",
                                40.0,
                                "Desserts",
                                "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&auto=format&fit=crop",
                                3,
                                true,
                                true
                        ),
                        new FoodItem(
                                "Chocolate Fudge Sundae",
                                "Creamy Belgian chocolate & vanilla scoops topped with warm chocolate fudge syrup and crunchy roasted nuts.",
                                55.0,
                                "Desserts",
                                "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop",
                                3,
                                true,
                                true
                        ),
                        new FoodItem(
                                "Kolkata Rasgulla (2 pcs)",
                                "Soft spongy cottage cheese spheres poached in delicate light cardamom sugar syrup.",
                                40.0,
                                "Desserts",
                                "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop",
                                3,
                                true,
                                true
                        )
                );

                foodItemRepository.saveAll(initialItems);
                log.info("Initialized {} food items across all canteen categories.", initialItems.size());
            }
        };
    }
}
