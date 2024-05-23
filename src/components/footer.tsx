import React from "react";

export default function Footer() {
  return (
    <div className='fixed inset-x-0 bottom-0'>
      <div className='px-4 py-3 text-muted-foreground'>
        <p className='text-center text-sm font-medium'>
          Made with ❤️ by {""}
          <a
            href='https://www.instagram.com/wizzie_dev?igsh=MXRsYWkxOTl3aTFiaQ=='
            className='inline-block underline'
          >
            Wizzie
          </a>
        </p>
      </div>
    </div>
  );
}
