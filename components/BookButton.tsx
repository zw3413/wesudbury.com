'use client'


interface BookButtonProps {
    lang: string,
    rideId: string,
    translations: { [key: string]: string }
}

export default function BookButton({ lang, rideId, translations }: BookButtonProps) {


  

    return (

        <a href={`/${lang}/rideshare/book/${rideId}`} className="block w-full bg-[rgb(255,183,77)] hover:bg-[rgb(255,163,57)] text-[rgb(33,41,49)] text-center py-3 rounded-lg font-semibold transition duration-300">
            {translations['bookRide']}
        </a> 
    ) 
}