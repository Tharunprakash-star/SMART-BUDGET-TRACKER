window.calculateBudget = function(salary, familySize, priorities, savingsTarget = 15) {
    const domains = [
        { key: "food", name: "Food & Groceries", icon: "🍽", isEssential: true },
        { key: "rent", name: "Rent / Housing", icon: "🏠", isEssential: true },
        { key: "utilities", name: "Utilities", icon: "💡", isEssential: true },
        { key: "transport", name: "Transportation", icon: "🚗", isEssential: false },
        { key: "medical", name: "Medical & Healthcare", icon: "🏥", isEssential: true },
        { key: "education", name: "Education", icon: "📚", isEssential: false },
        { key: "savings", name: "Savings", icon: "💰", isEssential: false, minLimit: 10 },
        { key: "entertainment", name: "Entertainment", icon: "🎬", isEssential: false },
        { key: "insurance", name: "Insurance", icon: "🛡", isEssential: false },
        { key: "misc", name: "Miscellaneous", icon: "📦", isEssential: false }
    ];

    const baseWeights = {
        food: 15, rent: 25, utilities: 10, transport: 8, medical: 5,
        education: 5, savings: savingsTarget, entertainment: 5, insurance: 5, misc: 7
    };

    let adjustedWeights = { ...baseWeights };
    if (familySize > 4) {
        adjustedWeights.food += 10;
        adjustedWeights.medical += 5;
    } else if (familySize > 1) {
        adjustedWeights.food += (familySize - 1) * 2;
    }

    Object.keys(priorities).forEach(key => {
        if (key === "savings") return; // Savings is fixed by target
        const p = priorities[key];
        // 1-10 scale. 5.5 is neutral. Sensitivity is 1.5
        adjustedWeights[key] += (p - 5.5) * 1.5;
    });

    if (adjustedWeights.savings < savingsTarget) adjustedWeights.savings = savingsTarget;
    
    const essentials = ["food", "rent", "utilities", "medical"];
    essentials.forEach(e => {
        if (adjustedWeights[e] < 5) adjustedWeights[e] = 5;
    });

    const totalWeight = Object.values(adjustedWeights).reduce((a, b) => a + b, 0);
    const scale = 100 / totalWeight;
    
    return domains.map(d => {
        const percentage = (adjustedWeights[d.key] * scale);
        const amount = (salary * percentage) / 100;
        return {
            ...d,
            percentage: parseFloat(percentage.toFixed(1)),
            amount: parseFloat(amount.toFixed(2))
        };
    });
};

window.getInvestmentSuggestions = function(savingsAmount, salary, allocation) {
    const suggestions = [];
    const savingsPercentage = (savingsAmount / salary) * 100;
    
    if (salary < 2000) {
        suggestions.push("💡 Tip: Consider cost optimization. Track small daily expenses to find leakages.");
    }
    if (savingsPercentage > 25) {
        suggestions.push("🚀 Strategy: Since your savings are > 25%, look into aggressive growth strategies like Equity-linked schemes.");
    }

    const sixMonthFund = (salary * 0.7) * 6;
    suggestions.push(`Emergency Fund: Aim to save ${sixMonthFund.toFixed(0)} for a 6-month reserve.`);

    if (savingsAmount > 0) {
        suggestions.push("Mutual Funds: Good for long-term growth.");
        suggestions.push("Index Funds: Low-cost diversified investment.");
    }
    if (savingsAmount > 5000) {
        suggestions.push("Fixed Deposits: Safe and stable returns.");
        suggestions.push("Gold Investments: Hedge against inflation.");
    }
    if (savingsAmount > 10000) {
        suggestions.push("Retirement Planning: Tax-efficient saving.");
        suggestions.push("SIP (Systematic Investment Plan): Regular monthly investing.");
    }
    return suggestions;
};

window.getWarnings = function(allocation, salary) {
    const warnings = [];
    const rent = allocation.find(a => a.key === "rent");
    const savings = allocation.find(a => a.key === "savings");

    if (rent && rent.percentage > 40) {
        warnings.push("⚠️ Warning: Rent is more than 40% of your salary. Consider downsizing.");
    }
    if (savings && savings.percentage < 10) {
        warnings.push("⚠️ Warning: Savings are less than 10%. Your financial buffer is low.");
    }
    return warnings;
};
