import React, { useEffect, useState } from 'react';

interface Data {
    id: number;
    name: string;
}

const DataFetcher: React.FC = () => {
    const [data, setData] = useState<Data | null>(null);

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users/1')
            .then((response) => response.json())
            .then((json: Data) => setData(json));
    }, []);

    return (
        <div>
            {data ? (
                <div>
                    <h3>{data.name}</h3>
                    <p>ID: {data.id}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default DataFetcher;
