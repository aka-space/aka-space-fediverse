import React from 'react';
import HeaderUnauthenticated from './headers/HeaderUnauthenticated';
import Link from 'next/link';
import Image from 'next/image';
import HeaderUserInfo from './headers/HeaderUserInfo';

const Header = () => {
    const user = {
        username: 'johndoe',
        email: 'johndoe@gmail.com',
        avatarUrl: '',
    };
    return (
        <header className="w-full fixed px-4 py-4 bg-card shadow-md z-50">
            <section className="flex items-center justify-between max-w-7xl mx-auto">
                {/* Brand */}
                <Link href="/" className="flex items-center" aria-label="Home">
                    <Image
                        src="/images/logo.png"
                        alt="Logo"
                        width={50}
                        height={50}
                        className="object-contain h-10 w-10"
                    />
                    <h1 className="text-2xl font-bold ml-2">AKA</h1>
                </Link>
                {/* User */}
                {user ? (
                    <HeaderUserInfo
                        user={user}
                        notifications={[
                            {
                                id: '1',
                                message: 'Your post has a new comment!',
                                read: false,
                                thumbnailUrl:
                                    'https://via.placeholder.com/150/0000FF/808080?Text=Digital.com',
                                createdAt: new Date().toISOString(),
                                title: 'New Comment',
                            },
                            {
                                id: '2',
                                message:
                                    'Your profile was viewed 10 times today.',
                                read: true,
                                thumbnailUrl:
                                    'https://via.placeholder.com/150/FF0000/FFFFFF?Text=Down.com',
                                createdAt: new Date().toISOString(),
                                title: 'Profile Views',
                            },
                        ]}
                    />
                ) : (
                    <HeaderUnauthenticated />
                )}
            </section>
        </header>
    );
};

export default Header;
