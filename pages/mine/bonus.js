import Balances from "@components/mine/balances";
import Layout from "@components/layout";
import Form from "@components/form";
import Link from "next/link";
import HeadBox from "@components/headBox";
export default function Bonus() {
    return (
        <Layout>
            <HeadBox title="Bonus" />
            <div className='pageTitle'>
                <Link href="/mine" ><a className='back'><i className='fa fa-chevron-left'></i></a></Link>
                <h1>Bonus</h1>
            </div>
            <section>
                <Form
                    link="/api/mine/bonus"
                // redirect="/mine"
                >
                    <div>
                        <label>Effective Investors</label>
                        <input type="number" min="0" name="total_users" autoComplete="new-password" />
                    </div>
                    <div>
                        <label>Your earnings request</label>
                        <input type="number" min="0" name="amount" autoComplete="new-password" />
                    </div>
                    <div>
                        <label>Enter your security password</label>
                        <input type="password" min="0" name="password" autoComplete="new-password" />
                    </div>
                    <div>
                        <label>Your message</label>
                        <textarea type="text" name="message" autoComplete="new-password"  ></textarea>
                    </div>
                </Form>
                <p className="infoBox text-center">We will notify you after your request has been reviewed.</p>
            </section>
        </Layout>
    )
}