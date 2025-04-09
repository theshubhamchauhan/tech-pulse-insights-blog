
import { Helmet } from "react-helmet";
import MainLayout from "@/components/layout/MainLayout";

const About = () => {
  // SEO metadata for the About page
  const seoMetadata = {
    title: "About Us | TechPulse",
    description: "Learn more about TechPulse, our mission, and our team of tech enthusiasts bringing you the latest in technology news, trends, and insights.",
    canonicalUrl: "https://techpulse.example.com/about",
    ogType: "website",
  };

  return (
    <MainLayout>
      <Helmet>
        <title>{seoMetadata.title}</title>
        <meta name="description" content={seoMetadata.description} />
        <link rel="canonical" href={seoMetadata.canonicalUrl} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content={seoMetadata.ogType} />
        <meta property="og:title" content={seoMetadata.title} />
        <meta property="og:description" content={seoMetadata.description} />
        <meta property="og:url" content={seoMetadata.canonicalUrl} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoMetadata.title} />
        <meta name="twitter:description" content={seoMetadata.description} />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">About TechPulse</h1>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-lg mb-4">
              At TechPulse, we are dedicated to providing insightful, accurate, and timely coverage of the constantly evolving technology landscape. We believe that technology has the power to transform lives, businesses, and societies, and our mission is to help our readers navigate this transformation.
            </p>
            <p className="text-lg">
              Whether you're a tech enthusiast, industry professional, or simply curious about the latest innovations, TechPulse offers a blend of news, analysis, tutorials, and thought leadership to keep you informed and inspired.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Editorial Approach</h2>
            <p className="text-lg mb-4">
              We are committed to journalistic integrity, factual accuracy, and thoughtful analysis. Our editorial team thoroughly researches and verifies information before publishing, and we strive to present balanced perspectives on complex topics.
            </p>
            <p className="text-lg">
              While technology often advances rapidly, we take the time to understand and explain the implications of new developments, ensuring our readers gain not just information, but genuine insight.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Our Coverage Areas</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-3">Tech News & Trends</h3>
                <p>Breaking news, industry trends, and in-depth analysis of major tech developments.</p>
              </div>
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-3">Product Reviews</h3>
                <p>Honest, thorough evaluations of the latest hardware, software, and services.</p>
              </div>
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-3">Guides & Tutorials</h3>
                <p>Step-by-step instructions and best practices for making the most of technology.</p>
              </div>
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-3">Business & AI</h3>
                <p>How technology is transforming industries and the future of work.</p>
              </div>
            </div>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
            <p className="text-lg mb-4">
              Technology is better when explored together. We encourage our readers to engage with our content, share their perspectives, and connect with like-minded individuals.
            </p>
            <p className="text-lg">
              Follow us on social media, sign up for our newsletter, and join the conversation in our comment sections to become part of the TechPulse community.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-lg mb-4">
              Have a tip, feedback, or inquiry? We'd love to hear from you. Reach out to our team at <a href="mailto:contact@techpulse.example.com" className="text-primary hover:underline">contact@techpulse.example.com</a>.
            </p>
            <p className="text-lg">
              For press releases and news tips, please email <a href="mailto:news@techpulse.example.com" className="text-primary hover:underline">news@techpulse.example.com</a>.
            </p>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default About;
