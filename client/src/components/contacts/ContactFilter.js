import React, { useRef, useContext, useEffect } from "react";
import ContactContext from "../../context/contact/contactContext";

const ContactFilter = () => {
  const text = useRef("");
  const contactContext = useContext(ContactContext);
  const { clearFilter, filterContacts, filtered } = contactContext;

  useEffect(() => {
    if (!filtered) {
      text.current.value = "";
    }
  }, [filtered]);

  const onChange = () => {
    if (text.current.value) {
      filterContacts(text.current.value);
    } else {
      clearFilter();
    }
  };

  return (
    <form>
      <input
        ref={text}
        type="text"
        placeholder="Filter Contacts..."
        onChange={onChange}
      />
    </form>
  );
};

export default ContactFilter;
