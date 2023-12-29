import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
export const convertFileToUrl = (file: File) => URL.createObjectURL(file);


export function formatDate(dateString: string = ""): string {
    const currentDate: Date = new Date();
    const inputDate: Date = new Date(dateString);

    const timeDifference: number = currentDate.getTime() - inputDate.getTime();
    const seconds: number = Math.floor(timeDifference / 1000);
    const minutes: number = Math.floor(seconds / 60);
    const hours: number = Math.floor(minutes / 60);
    const days: number = Math.floor(hours / 24);
    const months: number = Math.floor(days / 30);
    const years: number = Math.floor(days / 365);


    if (years > 1) {
        return `${years} years ago`;
    } else if (years === 1) {
        return '1 year ago';
    } else if (months > 1) {
        return `${months} months ago`;
    } else if (months === 1) {
        return '1 month ago';
    } else if (days > 1) {
        return `${days} days ago`;
    } else if (days === 1) {
        return '1 day ago';
    } else if (hours > 1) {
        return `${hours} hours ago`;
    } else if (hours === 1) {
        return '1 hour ago';
    } else if (minutes > 1) {
        return `${minutes} minutes ago`;
    } else if (minutes === 1) {
        return '1 minute ago';
    } else {
        return 'Just now';
    }
}

export const getFormattedImageUrl = (imageUrl: string | undefined): string | undefined => {
    return imageUrl ? imageUrl.replace('/preview', '/view') : undefined;
};


export const checkIsLiked = (likeList: string[], userId: string) => {
    return likeList.includes(userId);
};