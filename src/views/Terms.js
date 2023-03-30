import react from 'react';
import { Link } from 'react-router-dom';
const Terms = () => {
    return (
        <>
            <div
                style={{ textAlign: 'center', padding: '26px' }}
            >
                <div >
                    <h3>Terms of Use <Link to="/#/"
                        style={{ color: 'yellow', fontSize: "14px" }}>Go Back</Link></h3>


                    <p style={{ fontWeight: 'bold', color: 'orange' }}>Introduction</p>
                    Welcome to CodeWithAI ("we," "us," or "our"). Our website offers an AI-driven platform designed to assist programmers in learning how to code through a subscription-based service. By using our website and its services, you agree to these Terms of Use and our Privacy Policy.
                    <p></p>
                    <p style={{ fontWeight: 'bold', color: 'orange' }}>Acceptance of Terms</p>
                    By accessing or using our website, you confirm that you have read, understood, and agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree with any of these terms, you are prohibited from using or accessing our website and its services.
                    <p></p>

                    <p style={{ fontWeight: 'bold', color: 'orange' }}>Subscription Services</p>
                    We offer various subscription plans to access our platform. By subscribing to a plan, you agree to pay the applicable fees and any applicable taxes. All fees and charges are non-refundable unless required by law.
                    <p></p>
                    <p style={{ fontWeight: 'bold', color: 'orange' }}>Changes to Subscription Plans and Pricing</p>
                    We reserve the right to change our subscription plans and pricing at any time. Any changes will be communicated to you in advance, and you will have the option to continue with your subscription or cancel.
                    <p></p>
                    <p style={{ fontWeight: 'bold', color: 'orange' }}>Cancellation and Refunds</p>
                    You may cancel your subscription at any time. Refunds are not provided for any partial or unused subscription periods. To cancel, please follow the instructions provided on our website.
                    <p></p>
                    <p style={{ fontWeight: 'bold', color: 'orange' }}>Limitation of Liability</p>
                    To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including, but not limited to, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use or inability to use our website and its services.
                    <p></p>
                    <p style={{ fontWeight: 'bold', color: 'orange' }}>No Warranty</p>
                    Our website and its services are provided "as is" and "as available" without any warranty of any kind, either express or implied, including, but not limited to, the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
                    <p></p>
                    <p style={{ fontWeight: 'bold', color: 'orange' }}>Indemnification</p>
                    You agree to defend, indemnify, and hold harmless [Your Website Name], its affiliates, and their respective officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including, without limitation, reasonable legal and accounting fees, arising out of or in any way connected with your access to or use of our website and its services.
                    <p></p>
                    <p style={{ fontWeight: 'bold', color: 'orange' }}>Governing Law</p>
                    These Terms of Use shall be governed and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
                    <p></p>
                    <p style={{ fontWeight: 'bold', color: 'green' }}>Changes to Terms of Use</p>
                    We reserve the right to update or modify these Terms of Use at any time. Your continued use of our website and its services after any changes constitutes your acceptance of the new Terms of Use. It is your responsibility to periodically review these Terms of Use for any changes.
                    <p></p>
                    <p style={{ fontWeight: 'bold', color: 'orange' }}>Contact Us</p>
                    If you have any questions or concerns about these Terms of Use, please contact us at clarionnorth@gmail.com.
                    <p></p>
                    <p style={{ fontWeight: 'bold', color: 'orange' }}>Privacy Policy</p>

                    Please refer to our Privacy Policy for information on how we collect, use, and disclose your personal information. By using our website and its services, you agree to our Privacy Policy.

                    Again, this is not legal advice and you should consult with an attorney to ensure that your Terms of Use and Privacy Policy meet all legal requirements.
                </div>
            </div>
        </>
    )
}

export default Terms;