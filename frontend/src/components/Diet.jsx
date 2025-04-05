export default function Diet({ dietItems, setDietItems }) {
    function removeFromDiet(index) {
        const updatedDiet = dietItems.filter((_, i) => i !== index);
        setDietItems(updatedDiet);
        localStorage.setItem("diet", JSON.stringify(updatedDiet));
    }

    const totalCalories = dietItems.reduce((sum, item) => sum + item.calories, 0);
    const totalProtein = dietItems.reduce((sum, item) => sum + item.protein, 0);

    return (
        <div className="w-1/2 flex flex-col items-center">
            <div className="w-full max-w-lg p-6 bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-neon-green">Your Daily Diet</h2>

                {dietItems.length === 0 ? (
                    <p>No food items added yet.</p>
                ) : (
                    <ul className="space-y-2">
                        {dietItems.map((item, index) => (
                            <li key={index} className="flex justify-between p-2 bg-gray-700 rounded-md">
                                <span>{item.name} - {item.calories.toFixed(2)} Kcal, {item.protein.toFixed(2)}g Protein</span>
                                <button 
                                    className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-700"
                                    onClick={() => removeFromDiet(index)}
                                >
                                    ❌
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="mt-4 p-4 bg-gray-900 rounded-lg text-center border border-neon-green">
                    <p><strong>Total Calories:</strong> {totalCalories.toFixed(2)} Kcal</p>
                    <p><strong>Total Protein:</strong> {totalProtein.toFixed(2)}g</p>
                </div>
            </div>
        </div>
    );
}
