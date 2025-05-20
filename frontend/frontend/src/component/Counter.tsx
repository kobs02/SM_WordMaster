import React, { useState } from 'react';

interface CounterProps {
    initialCount: number;
}

const Counter: React.FC<CounterProps> = ({ initialCount }) => {
    const [count, setCount] = useState<number>(initialCount);

    return (
        <div>
            <h2>Current Count: {count}</h2>
    <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
);
};

export default Counter;
