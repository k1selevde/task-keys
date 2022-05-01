import { useCallback, useEffect, useState } from 'react';
import { IItem } from './index';

type Props =  {
    initialData: IItem[];
    sorting: 'ASC' | 'DESC'
}

type Key = IItem & {active: boolean}

export function Keys({initialData, sorting}: Props) {
    const mapListFromProps = (items: IItem[]): Key[] => items.map(i => ({...i, active: false}))

    const [list, setList] = useState<Key[]>(mapListFromProps(initialData));
    const [newValue, setNewValue] = useState<string>('')

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === "Escape") {
            setList(list => list.map(i => ({...i, active: false})))
            setNewValue('')
        }

        if (event.key === "Enter") {
            const activeIndex = list.findIndex(item => item.active)

            setList([
                ...list.slice(0, activeIndex),
                { ...list[activeIndex], active: false, name: newValue },
                ...list.slice(activeIndex + 1),
            ])
        }
    }, [list, newValue])

    const handleClick = (id: number) => {
        const index = list.findIndex(i => i.id === id)
        const everyNotActive = list.every(i => !i.active)

        if (index > -1 && everyNotActive) {
            setList([
                ...list.slice(0, index),
                { ...list[index], active: true },
                ...list.slice(index + 1),
            ])
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [handleKeyDown])

    const renderItem = ({name, id, active}: Key) => {
        if (active) {
            return <input
                key={id}
                type='text'
                defaultValue={newValue || name}
                data-testid="test-input-id"
                onChange={(e) => setNewValue(e.target.value)}
            />
        }

        return <div onClick={() => handleClick(id)} key={id}>{name}</div>
    }

    return <div>
        {
            list
            .sort((a, b) => sorting === 'DESC' ? (b.id - a.id) : (a.id - b.id))
            .map(renderItem)
        }
    </div>;
}
