import Head from 'next/head';
import { useRouter } from 'next/router';
import ClientOnly from '../../../../../components/ClientOnly';

// path => /course/[id]/dashboards/[studentID]
export default function Index() {
  return (<div>
    <Head>
      <title>Dashboard</title>
    </Head>
    <ClientOnly>
      <IndexPage/>
    </ClientOnly>
  </div>);
};

function IndexPage() {
  const router = useRouter();
  const {id: courseID, studentID} = router.query; // extract id from router.query and rename to courseID, but not rename studentID
  return <div>
    Hello {courseID} {studentID}
  </div>;
};