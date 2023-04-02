import Image from 'next/image'
import data from '../data.json'

function LinkCard({ href, title, image }: { href: string, title: string, image ?: string }) {
  return (
    <a href={href} className="flex items-center p-4 bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100 w-full rounded-md hover:scale-105 transition-all border border-gray-300 mb-3 duration-300">
      <div className="flex flex-col text-center ">
        <h2 className="font-semibold w-full text-center">{title}</h2>
      </div>
    </a>
  );
}

export default function Home() {
  return (
    <div className="flex mx-auto items-center flex-col w-full justify-center mt-16 px-8"> 
      <Image
      className='rounded-full'
        alt={data.name}
        src={data.avatar}
        width={120}
        height={120}
      />
      <h1 className='font-bold mt-4 mb-8 text-xl text-gray-100'>{data.name}</h1>
      {data.links.map((link) => (
        <LinkCard key={link.href} {...link} />
      ))}
    </div>  
  );
}

