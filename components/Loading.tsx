'use client';
import { Mosaic } from 'react-loading-indicators';

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center animate-fade-in pt-6">
            <Mosaic></Mosaic>
        </div>
    )
}