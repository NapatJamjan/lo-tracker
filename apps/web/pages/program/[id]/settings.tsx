import Head from 'next/head';
import client from '../../../apollo-client';
import { gql, useMutation } from '@apollo/client';
import { GetServerSideProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { KnownProgramMainMenu, ProgramMainMenu, ProgramSubMenu } from '../../../components/Menu';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface ProgramModel {
  id: string;
  name: string;
  description: string;
};

interface EditProgramModel {
  name: string;
  description: string;
}

export default ({program}: {program: ProgramModel}) => {
  const router = useRouter();
  const [editProgram, { loading: submitting }] = useMutation<{editProgram: {id: string}}, {id: string, input: EditProgramModel}>(EDIT_PROGRAM);
  const { register, handleSubmit } = useForm<EditProgramModel>({
    defaultValues: {
      name: program.name,
      description: program.description
    }
  });
  const saveProgram = (form: EditProgramModel) => {
    if (submitting) return;
    editProgram({
      variables: {
        id: program.id,
        input: form
      }
    }).then(() => {
      alert('updated');
      router.replace(router.asPath);
    });
  };
  return <div>
    <Head>
      <title>Program Settings</title>
    </Head>
    <KnownProgramMainMenu programID={program.id} programName={program.name}/>
    <ProgramSubMenu programID={program.id} selected={'settings'}/>
    <p className="mt-4 mb-2 underline">Program Settings</p>
    <form onSubmit={handleSubmit(saveProgram)}>
    <div className="grid grid-cols-2 gap-4">
      <div>Program Name</div>
      <input {...register('name')} type="text" placeholder="program's name" className="border-4 rounded-md p-1 text-sm"/>
      <div>Program Description</div>
      <textarea {...register('description')}  placeholder="program's description" cols={30} className="border-4 rounded-md p-2" rows={4}></textarea>
    </div>
    <div className="flex justify-end">
      <input type="submit" value="save" className="mt-3 py-2 px-4 bg-green-300 hover:bg-green-500 rounded-lg"/>
    </div>
    </form>
  </div>;
};

interface Params extends ParsedUrlQuery {
  id: string;
}

export const getServerSideProps: GetServerSideProps<{program: ProgramModel}> = async (context) => {
  const { id: programID } = context.params as Params;
  const { data } = await client.query<{program: ProgramModel}, {programID: string}>({
    query: GET_PROGRAM,
    variables: {
      programID
    }
  });
  return {
    props: {
      program: data.program,
    },
  };
};

const GET_PROGRAM = gql`
  query Program($programID: ID!) {
    program(programID: $programID) {
      id
      name
      description
}}`;
const EDIT_PROGRAM = gql`
  mutation EditProgram($id: ID!, $input: CreateProgramInput!) {
    editProgram(id: $id, input: $input) {
      id
}}`;
