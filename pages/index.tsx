import Image from 'next/image';
import data from '../data.json';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';

function LinkCard({ href, title, image }: { href: string, title: string, image ?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center p-4 bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100 w-full rounded-md hover:scale-105 transition-all border border-gray-300 mb-3 duration-300">
      <div className="flex flex-col text-center ">
        <h2 className="font-semibold w-full text-center">{title}</h2>
      </div>
    </a>
  );
}

export default function Home() {
  return (
    <div className="flex mx-auto items-center flex-col w-full justify-center mt-16 px-8 max-w-2xl"> 
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
      <div className="flex justify-center gap-7 w-full m-5 text-white">
        {data.socials.map((link) => {
          if (link.href.includes('twitter')) {
            return (
              <a href={link.href} key={link.href} target="_blank" rel="noopener noreferrer">
                <TwitterIcon className="w-10 h-10"/>
              </a>
            );
          }
          if (link.href.includes('github')) {
            return (
              <a href={link.href} key={link.href} target="_blank" rel="noopener noreferrer">
                <GitHubIcon className="w-10 h-10"/>
              </a>
            );
          }
          if (link.href.includes('linkedin')) {
            return (
              <a href={link.href} key={link.href} target="_blank" rel="noopener noreferrer">
                <LinkedInIcon className="w-10 h-10"/>
              </a>
            );
          }
          if (link.href.includes('instagram')) {
            return (
              <a href={link.href} key={link.href} target="_blank" rel="noopener noreferrer">
                <InstagramIcon className="w-10 h-10"/>
              </a>
            );
          }
          if (link.href.includes('t.me')) {
            return (
              <a href={link.href} key={link.href} target="_blank" rel="noopener noreferrer">
                <TelegramIcon className="w-10 h-10"/>
              </a>
            );
          }
        })}
      </div>
    </div>  
  );
}
