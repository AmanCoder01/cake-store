import { useEffect } from 'react';

const Meta = ({ title, description, keywords }) => {
  useEffect(() => {
    document.title = title ? `${title} | Cake Baker's` : "Cake Baker's | Delicious Handcrafted Cakes";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description || 'Order delicious handcrafted cakes online. Best bakery for birthdays, weddings, and anniversaries.');
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords || 'cake shop near me, order cake online, birthday cake, wedding cake');
    }
  }, [title, description, keywords]);

  return null;
};

export default Meta;
