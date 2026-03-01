import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function ProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProject = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id,title,description,data,is_public,owner_id,created_at')
        .eq('id', id)
        .eq('is_public', true)
        .maybeSingle();

      if (!isMounted) return;

      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setProject(data);
      setLoading(false);
    };

    loadProject();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) return <p>Loading project...</p>;
  if (notFound) return <p>Not found.</p>;

  return (
    <section>
      <h1>{project.title}</h1>
      <p>{project.description || 'No description yet.'}</p>
      <div className="card">
        <p>BPM: {project.data?.bpm ?? 'n/a'}</p>
        <p>Pattern: {JSON.stringify(project.data?.pattern ?? [])}</p>
        <p>Samples: {(project.data?.sampleRefs ?? []).join(', ') || 'none'}</p>
      </div>
    </section>
  );
}
