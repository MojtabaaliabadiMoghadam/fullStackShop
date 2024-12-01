import type {AxiosResponse} from 'axios';
import axios from 'axios';
// axios.defaults.withCredentials = true;


axios.defaults.withCredentials = true;  // اصلاح با withCredentials

interface IResponse {
    status: number;
    message: string;
    data: {
        [key: string]: any;
    };
    errors: IError[];
    timestamp?: string;
}

interface IError {
    message: string;
    code: string;
    field: string;
}

interface FetchDataOptions {
    url: string;
    data?: any | null;
    method?: string | HttpMethods;
    headers?: Record<string, string>;
    parameters?: Record<string, string> | any;
    content_type?: string;
}

interface IAlertOptions {
    icon: string;
    text: string;
    title: string;
    timer: number;
    palette: string;
}

/**
 * @var HttpMethods Allowed http methods
 */
enum HttpMethods {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

// A collection of helper functions.
export function useHelpers() {
    const { $toast } = useNuxtApp()
    const runtimeConfig = useRuntimeConfig();
    const backEndUrl: string | null = runtimeConfig.public?.BACK_END_URL
    // const isDev: boolean = process.env.NODE_ENV === 'development';
    const useAuthTokenHelpers = () => useState("auth_token_helpers");

    const setAuthTokenHelpers = (token: string | null) => {  // تعیین نوع token
        const authToken = useAuthTokenHelpers();
        authToken.value = token;
    };

    function isFilled(value: any): boolean {
        return value !== undefined && value !== null && value !== '';
    }

    function isSet(value: any): boolean {
        return typeof value !== 'undefined' && value !== null;
    }

    function isNumber(value: any): boolean {
        return typeof value === 'number' && !isNaN(value);
    }


    function objectOrArrayIsNotEmpty(value: any): boolean {
        if (value !== null && Array.isArray(value)) {
            return value.length > 0;
        } else if (value !== null && typeof value === 'object') {
            return Object.keys(value).length > 0;
        }
        return false;
    }

    function generateRandomString(n: number = 2): string {
        const alphabet = 'abcdefghijklmnopqrstuvwxyz';
        let result = '';
        const alphabetLength = alphabet.length;
        for (let i = 0; i < n; i++) {
            const randomIndex = Math.floor(Math.random() * alphabetLength);
            result += alphabet.charAt(randomIndex);
        }
        const timestamp = Date.now().toString();
        result = `${result}_${timestamp}_${result}`;
        return result;
    }

    function searchInArray(items: any[] = [], search: string | null): any[] {
        return search && isFilled(search) ? items.filter(item => {
            const lowerSearch = search.toLowerCase();
            for (const key in item) {
                if (item.hasOwnProperty(key)) {
                    let value = item[key];
                    if (typeof value === 'number') {
                        value = value.toString();
                    }
                    if (typeof value === 'string' && isFilled(value) && value.toLowerCase().includes(lowerSearch)) {
                        return true;
                    }
                }
            }
            return false;
        }) : items;
    }

    function getUrl(url: string, api: boolean = true, hash_data: string | null = null): string {
        const baseUrl = backEndUrl;
        let normalizedUrl = url.replace(/\/+/g, '/');
        normalizedUrl = normalizedUrl.startsWith('/') ? normalizedUrl.slice(1) : normalizedUrl;
        normalizedUrl = api ? `api/${normalizedUrl}` : normalizedUrl;

        if (hash_data && isFilled(hash_data)) {
            normalizedUrl += `#${hash_data}`;
        }

        if (baseUrl?.endsWith('/') && normalizedUrl.startsWith('/')) {
            normalizedUrl = normalizedUrl.slice(1);
        } else if (!baseUrl?.endsWith('/') && !normalizedUrl.startsWith('/')) {
            normalizedUrl = `/${normalizedUrl}`;
        }

        return `${baseUrl}${normalizedUrl}`;
    }

    function addBackendToImageUrl(imageUrl: string): string {
        const cleanedImageUrl = imageUrl.replace(/^\/+/, '');
        return `${backEndUrl}/${cleanedImageUrl}`;
    }


    function extractDate(dateTimeString:string) {
        const date = new Date(dateTimeString);
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getUTCDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }
    async function fetchData(
        {
            url,
            data = null,
            method = 'get',
            headers = {},
            parameters = null,
        }: FetchDataOptions
    ) {

        url = url.replace(/^\/|\/$/g, '');
        headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...headers,
        };
        const options = {
            url,
            method,
            headers: {
                ...headers,
            },
            data,
            params: parameters,
            withCredentials: false,
        };

        try {
            const res: AxiosResponse = await axios(options);
            const data: IResponse = res.data;
            return {
                status: res.status,
                data: data.data,
                errors: data.errors,
                message: data.message,
            };
        } catch (error: any) {
            if (error.response) {
                return {
                    status: error.response.status,
                    errors: error.response.data?.errors || [],
                    message: error.response.data?.message || 'An error occurred',
                };
            } else {
                return {
                    status: 500,
                    errors: [{ message: 'An unknown error occurred', code: '', field: '' }],
                    message: 'An error occurred',
                };
            }
        }
    }


    const showErrorToast = (message: string) => {
        $toast(message, {
            type: 'error',
            position: 'top-center',
            duration: 3000,
            theme: 'light',
        })
    }

    const showSuccessToast = (message: string) => {
        $toast(message, {
            type: 'success',
            position: 'top-center',
            duration: 3000,
            theme: 'light',
        })
    }
    function toPersianNumber(num:any) {
        const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
        return num.toString().replace(/[0-9]/g, (digit) => persianDigits[digit]);
    }

    function getJalaliOptions(type:any) {
        const options = [];

        if (type === 'year') {
            const currentDate = new Date();
            const gYear = currentDate.getFullYear();
            const gMonth = currentDate.getMonth() + 1;
            const gDay = currentDate.getDate();

            // Approximate conversion from Gregorian to Jalali
            const jalaliYear = gYear - 621 - ((gMonth < 3 || (gMonth === 3 && gDay < 21)) ? 1 : 0);

            for (let i = jalaliYear; i > jalaliYear - 100; i--) {
                options.push({ name: i, id: i });
            }
        } else if (type === 'month') {
            const jalaliMonths = [
                "فروردین", "اردیبهشت", "خرداد",
                "تیر", "مرداد", "شهریور",
                "مهر", "آبان", "آذر",
                "دی", "بهمن", "اسفند"
            ];
            jalaliMonths.forEach((month, index) => {
                options.push({ name: month, id: index + 1 });
            });
        } else if (type === 'day') {
            for (let i = 1; i <= 31; i++) {
                options.push({ name: i, id: i });
            }
        } else {
            throw new Error("Invalid type. Valid types are 'year', 'month', or 'day'.");
        }

        return options;
    }
    const isObjectEmpty = (obj:any) => Object.keys(obj).length === 0;
    return {
        backEndUrl,
        isFilled,
        isSet,
        isNumber,
        objectOrArrayIsNotEmpty,
        generateRandomString,
        searchInArray,
        fetchData,
        getUrl,
        addBackendToImageUrl,
        setAuthTokenHelpers,
        showSuccessToast,
        showErrorToast,
        extractDate,
        getJalaliOptions,
        isObjectEmpty
    };
}
