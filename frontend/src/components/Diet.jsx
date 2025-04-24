import { useEffect } from "react";

export default function Diet({ dietItems, setDietItems }) {
    // Remove one item from diet
    function removeFromDiet(index) {
        const updatedDiet = dietItems.filter((_, i) => i !== index);
        setDietItems(updatedDiet);
        localStorage.setItem("diet", JSON.stringify(updatedDiet));
    }

    // Clear all diet items
    function clearDiet() {
        setDietItems([]);
        localStorage.setItem("diet", JSON.stringify([]));
    }

    // Calculate total calories and protein
    const totalCalories = dietItems.reduce((sum, item) => sum + item.calories, 0);
    const totalProtein = dietItems.reduce((sum, item) => sum + item.protein, 0);

    useEffect(() => {
        const storedDiet = localStorage.getItem("diet");
        if (storedDiet) {
            setDietItems(JSON.parse(storedDiet));
        }
    }, [setDietItems]);

    return (
        <div className="w-full flex flex-col items-center p-4">
            <div className="w-full max-w-lg p-6 bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-neon-green text-center">🍽️ Your Daily Diet</h2>

                {dietItems.length === 0 ? (
                    <p className="text-gray-300 text-center">No food items added yet.</p>
                ) : (
                    <>
                        <ul className="space-y-2">
                            {dietItems.map((item, index) => (
                                <li
                                    key={index}
                                    className="flex justify-between items-center p-3 bg-gray-700 rounded-md shadow-sm"
                                >
                                    <span className="text-white">
                                        {item.name} – <span className="text-yellow-400">{item.calories.toFixed(2)} Kcal</span>,{" "}
                                        <span className="text-blue-400">{item.protein.toFixed(2)}g Protein</span>
                                    </span>
                                    <button
                                        onClick={() => removeFromDiet(index)}
                                        className="text-red-500 hover:text-red-700 text-xl transition"
                                        title="Remove"
                                    >
                                        ❌
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-neon-green text-center text-white">
                            <p className="mb-2"><strong>Total Calories:</strong> {totalCalories.toFixed(2)} Kcal</p>
                            <p><strong>Total Protein:</strong> {totalProtein.toFixed(2)}g</p>
                        </div>

                        <div className="mt-4 text-center">
                            <button
                                onClick={clearDiet}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                            >
                                🧹 Clear All
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

