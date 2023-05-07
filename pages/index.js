import { userControl } from '@utils/crypt'
import Head from 'next/head'
import Layout from '@components/layout'
import TotalBallance from '@components/totalBallance'
import MarqueeNotification from '../components/home/marqueeNotification'
import LatestAnnouncement from '../components/home/latestAnnouncement'
import ButtonMenu from '../components/buttonMenu'
import Accounts from '../components/home/accounts'
import About from '../components/home/about'
import TradingCards from '../components/home/tradingCards'
import PlatformDataDisplay from '../components/home/platformDataDisplay'
import GlobalPartners from '../components/home/globalPartners'
import HeadBox from '@components/headBox'
import ModalPopup from '@components/home/modalPopupOld'
import { hasCookie } from 'cookies-next'
import HomeSlider from '@components/home/homeSlider'

import ChatButtons from "@components/home/chatButtons";
export default function Home({ popupModalStatus }) {
  return (
    <Layout>
      <HeadBox title="Home" />
      {/* <ChatButtons /> */}
      {/* <HomeSlider /> */}
      <ModalPopup status={popupModalStatus} />
      <TotalBallance />
      <MarqueeNotification />
      <LatestAnnouncement />
      <ButtonMenu />
      <Accounts />
      <TradingCards />
      <PlatformDataDisplay />
      <About />
      <GlobalPartners />
    </Layout>
  )
}

export async function getServerSideProps(context) {
  return userControl(context, {
    popupModalStatus: hasCookie('popupModal', context)
  })
}
