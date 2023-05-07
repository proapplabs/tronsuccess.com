import { userControl } from '@utils/crypt'
import Layout from '@components/layout'
import WithdrawalForm from '@components/mine/withdrawalForm'
import Link from 'next/link'
import HeadBox from '@components/headBox'
import useTranslation from 'next-translate/useTranslation'

export default function Withdrawal({ datas }) {
    const { t, lang } = useTranslation('common');
    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitAction(true)
        var form = document.querySelector('form');
        var str = serialize(form);
        var obj = serialize(form, { hash: true });
        if (!submitAction) {
            axios.post(
                '/api/login',
                obj
            ).then(function (response) {
                if (response.data.error) {
                    setSubmitAction(false)
                    alert('error', 'Error', response.data.error)
                } else {
                    alert('success', 'Success', t("you-are-logged"))
                    router.push("/")
                }
            }).catch(function (error) {
                setSubmitAction(false)
                alert('error', 'Error', t("alert-500"))
            });
        }

    }
    return (
        <Layout>
            <HeadBox title="Withdrawal" />
            <div className='pageTitle'>
                <Link href="/mine" ><a className='back'><i className='fa fa-chevron-left'></i></a></Link>
                <h1>{t("withdrawal")}</h1>
            </div>
            <WithdrawalForm />
        </Layout>
    )
}
export async function getServerSideProps(context) {
    return userControl(context, {
    })
}
