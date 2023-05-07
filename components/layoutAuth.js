import NavigationTop from '@components/navigationTop'
import NavigationBottom from '@components/navigationBottom'
import Head from 'next/head'
export default function LayoutAuth({ children, pageClass }) {
    return (
        <main className={'container page_auth ' + pageClass}>
            <NavigationTop />
            <div className=' animate__animated animate__fadeIn'>
                {children}
            </div>
        </main>
    )
}