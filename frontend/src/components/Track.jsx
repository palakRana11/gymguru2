import { useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import Diet from "./Diet";
import image from "../assets/TrackBanner.png"; // Import the banner image

export default function Track() {
    const loggedData = useContext(UserContext);
    const [foodItems, setFoodItems] = useState([]);
    const [selectedFood, setSelectedFood] = useState(null);
    const [grams, setGrams] = useState(100);
    const [dietItems, setDietItems] = useState(
        JSON.parse(localStorage.getItem("diet")) || []
    );

    function searchFood(event) {
        const query = event.target.value.trim();
        if (query !== "") {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No token found! User might not be logged in.");
                return;
            }

            fetch(`http://localhost:8000/food/search/${query}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => response.json())
            .then((data) => {
                setFoodItems(data.message === undefined ? data : []);
            })
            .catch((error) => console.error("Error fetching data:", error));
        } else {
            setFoodItems([]);
        }
    }

    function handleFoodSelect(food) {
        setSelectedFood(food);
        setFoodItems([]); // Hides the dropdown when a food item is selected
    }

    function addToDiet(food) {
        const newFood = {
            name: food.name,
            calories: (food.calories * grams) / 100,
            protein: (food.protein * grams) / 100,
            fat: (food.fat * grams) / 100,
            fiber: (food.fiber * grams) / 100,
        };

        const updatedDiet = [...dietItems, newFood];
        setDietItems(updatedDiet);
        localStorage.setItem("diet", JSON.stringify(updatedDiet));
    }

    return (
        <>
        {/* Banner Image */}
              <img
                src={image}
                alt="Track Banner"
                className="w-full h-81 object-cover rounded-xl mb-4"
              />
        <section className="h-screen flex flex-row justify-center items-start bg-gray-900 text-white p-6 w-full gap-10">
            {/* 🍽️ Food Search & Selection */}
            <div className="w-1/2 flex flex-col items-center">
                <div className="w-full max-w-md">
                    <input
                        className="w-full p-3 text-lg rounded-lg text-black border-2 border-transparent focus:border-neon-green transition-all outline-none"
                        type="search" 
                        placeholder="🔍 Search Food Items" 
                        onChange={searchFood}
                    />
                    {foodItems.length !== 0 && (
                        <div className="w-full p-3 bg-gray-700 rounded-lg mt-2 shadow-md">
                            {foodItems.map((item) => (
                                <p 
                                    className="p-2 border-b border-gray-500 cursor-pointer hover:bg-gray-600 hover:text-neon-green transition-all"
                                    key={item._id}
                                    onClick={() => handleFoodSelect(item)}
                                >
                                    {item.name}
                                </p>
                            ))}
                        </div>
                    )}
                </div>

                {selectedFood && (
                    <div className="w-full max-w-md p-4 bg-gray-900 bg-opacity-80 rounded-lg shadow-lg border border-neon-green mt-4">
                        {selectedFood.image && (
                            <div className="w-full flex justify-center">
                                <img 
                                    className="w-20 h-20 object-cover rounded-lg shadow-lg border border-neon-green"
                                    src={selectedFood.image} 
                                    alt={selectedFood.name} 
                                />
                            </div>
                        )}
                        <h2 className="text-md font-semibold text-neon-green text-center mt-2">
                            {selectedFood.name}
                        </h2>
                        <p className="text-sm text-gray-300 text-center">
                            {((selectedFood.calories * grams) / 100).toFixed(2)} Kcal per {grams}g
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-center text-sm">
                            <div>
                                <p className="font-bold text-gray-300">Protein</p>
                                <p>{((selectedFood.protein * grams) / 100).toFixed(2)}g</p>
                            </div>
                            <div>
                                <p className="font-bold text-gray-300">Carbs</p>
                                <p>{((selectedFood.carbohydrates * grams) / 100).toFixed(2)}g</p>
                            </div>
                            <div>
                                <p className="font-bold text-gray-300">Fat</p>
                                <p>{((selectedFood.fat * grams) / 100).toFixed(2)}g</p>
                            </div>
                            <div>
                                <p className="font-bold text-gray-300">Fiber</p>
                                <p>{((selectedFood.fiber * grams) / 100).toFixed(2)}g</p>
                            </div>
                        </div>
                        <input 
                            type="number" 
                            className="w-full p-2 rounded-lg text-black bg-gray-200 border-none focus:ring-neon-green mt-3"
                            placeholder="Quantity in grams"
                            value={grams}
                            onChange={(e) => setGrams(e.target.value)}
                        />
                        <button 
                            className="bg-neon-green text-purple p-2 rounded-lg hover:bg-green-500 transition-all shadow-md transform hover:scale-105 w-full mt-2"
                            onClick={() => addToDiet(selectedFood)}
                        >
                            ➕ Add to Diet
                        </button>
                    </div>
                )}
            </div>

            {/* 🥗 Diet Component */}
            <Diet dietItems={dietItems} setDietItems={setDietItems} />
        </section>
        </>
    );
}
