import { useEffect } from 'react';

type Handler = ({ key }: { key: string }) => void;

export const useKeyDown = (handler: Handler, deps: any[]) => {
    const keyDownHandler = (event: KeyboardEvent) => handler({ key: event.key });
    useEffect(() => {
        document.addEventListener('keydown', keyDownHandler);

        return () => document.removeEventListener('keydown', keyDownHandler);
    }, [...deps]);
};
