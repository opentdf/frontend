import { useEffect } from 'react';

type Handler = ({ key }: { key: string }) => void;

export const useKeyDown = (handler: Handler) => {
    useEffect(() => {
        const keyDownHandler = (event: KeyboardEvent) => handler({ key: event.key });
        document.addEventListener('keydown', keyDownHandler);
        return () => document.removeEventListener('keydown', keyDownHandler);
    }, [handler]);
};
