const Home = () => {
  return (
    <>
      <h2>Authorities</h2>
      <p>
        The Attribute Authority — is a database that lists all known attributes along with people and devices.
        It has no user interface and simply feeds ABACUS with the necessary data it needs to manage access.
      </p>

      <h2>Attributes</h2>
      <p>
        TDF protocol supports ABAC (Attribute Based Access Control). This allows
        TDF protocol to implement policy driven and highly scalable access
        control mechanism.
      </p>

      <h2>Entities</h2>
      <p>
        Entities can consist of non-person entities representing a process or
        server, or person entities representing a user. Entities can be assigned
        multiple Attributes to implement fine grained access permissions to TDF
        files.
      </p>
    </>
  );
};

Home.displayName = 'Home';

export default Home;
