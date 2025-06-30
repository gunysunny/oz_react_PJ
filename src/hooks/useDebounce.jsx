// src/hooks/useDebounce.js
import { useState, useEffect } from "react";

// 디바운스(입력 지연) custom hook
export default function useDebounce(value, delay = 500) {
    // 실제로 반영될 값을 저장하는 state
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        // value가 바뀌면 delay(ms) 후에 debounced 값 변경
        // delay동안 value가 바뀌면 이전 타이머는 취소됨
        const handler = setTimeout(() => setDebounced(value), delay);

        // cleanup: 다음 value 변경/언마운트시 타이머 해제
        return () => clearTimeout(handler);

        // value나 delay가 바뀔 때마다 다시 실행
    }, [value, delay]);

    // delay가 지난 뒤 확정된 value 반환
    return debounced;
}