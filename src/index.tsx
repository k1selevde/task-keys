import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Keys } from './Keys';

export interface IItem {
    id: number;
    name: string;
}

const initialData: IItem[] = [
    {
        id: 1,
        name: 'Иванов И.И.',
    },
    {
        id: 2,
        name: 'Петров П.П.',
    },
    {
        id: 3,
        name: 'Сидоров С.С.',
    },
];

function App() {
    const [sorting, setSorting] = useState<'ASC' | 'DESC'>('ASC');
    return (
        <React.StrictMode>
            <button
                onClick={() => setSorting(sorting === 'ASC' ? 'DESC' : 'ASC')}
            >
                Change sorting
            </button>
            Current sorting: {sorting}
            <Keys initialData={initialData} sorting={sorting} />
        </React.StrictMode>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
