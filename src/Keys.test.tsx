import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Keys } from './Keys';
import { IItem } from './index';

describe('Ключи', () => {
    let testData: IItem[];
    beforeEach(() => {
        testData = [
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
    });

    it('Список отрисовывается в правильном формате', () => {
        render(<Keys initialData={testData} sorting={'ASC'} />);

        const elements = screen.queryAllByText(/.+/);
        expect(elements.map((elem) => elem.textContent)).toEqual([
            'Иванов И.И.',
            'Петров П.П.',
            'Сидоров С.С.',
        ]);
    });

    it('Список реагирует на изменение сортировки', () => {
        const { rerender } = render(
            <Keys initialData={testData} sorting={'ASC'} />,
        );
        rerender(<Keys initialData={testData} sorting={'DESC'} />);

        const elements = screen.queryAllByText(/.+/);
        expect(elements.map((elem) => elem.textContent)).toEqual([
            'Сидоров С.С.',
            'Петров П.П.',
            'Иванов И.И.',
        ]);
    });

    it('Элементы списка редактируются по клику', () => {
        render(<Keys initialData={testData} sorting={'ASC'} />);
        const textElement = screen.getByText('Иванов И.И.');

        userEvent.click(textElement);

        expect(textElement).not.toBeInTheDocument();
        const inputElements = screen.getAllByRole('textbox');
        expect(inputElements.length).toBe(1);
        expect(inputElements[0]).toHaveValue('Иванов И.И.');

        userEvent.type(inputElements[0], '123');

        expect(inputElements[0]).toHaveValue('Иванов И.И.123');
    });

    it('По Enter происходит сохранение', () => {
        render(<Keys initialData={testData} sorting={'ASC'} />);
        userEvent.click(screen.getByText('Иванов И.И.'));

        userEvent.type(screen.getByRole('textbox'), '123{enter}');

        expect(screen.queryAllByRole('textbox').length).toBe(0);
        const elements = screen.queryAllByText(/.+/);
        expect(elements.map((elem) => elem.textContent)).toEqual([
            'Иванов И.И.123',
            'Петров П.П.',
            'Сидоров С.С.',
        ]);
    });

    it('По Escape происходит отмена', () => {
        render(<Keys initialData={testData} sorting={'ASC'} />);
        userEvent.click(screen.getByText('Иванов И.И.'));

        userEvent.type(screen.getByRole('textbox'), '123{esc}');

        expect(screen.queryAllByRole('textbox').length).toBe(0);
        const elements = screen.queryAllByText(/.+/);
        expect(elements.map((elem) => elem.textContent)).toEqual([
            'Иванов И.И.',
            'Петров П.П.',
            'Сидоров С.С.',
        ]);
    });

    it('Редактирование не слетает при сортировке', () => {
        const { rerender, container } = render(
            <Keys initialData={testData} sorting={'ASC'} />,
        );
        const textElement = screen.getByText('Иванов И.И.');
        userEvent.click(textElement);
        const inputElement = screen.getByRole('textbox');
        userEvent.type(inputElement, '123');

        rerender(<Keys initialData={testData} sorting={'DESC'} />);

        expect(inputElement).toBeInTheDocument();
        expect(inputElement).toHaveValue('Иванов И.И.123');
        const elements = Array.from(container.querySelectorAll('*'))
            .filter((elem) => {
                if (elem instanceof HTMLInputElement) {
                    return true;
                }
                const content = elem.textContent;
                return (
                    content === 'Иванов И.И.' ||
                    content === 'Петров П.П.' ||
                    content === 'Сидоров С.С.'
                );
            })
            .map((elem) => {
                if (elem instanceof HTMLInputElement) {
                    return elem.value;
                }
                return elem.textContent ?? '';
            });
        expect(removeDuplicates(elements)).toEqual([
            'Сидоров С.С.',
            'Петров П.П.',
            'Иванов И.И.123',
        ]);
    });
});

function removeDuplicates(arr: string[]): string[] {
    return Array.from(new Set(arr));
}
