import { use, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Box, Button, CircularProgress, Container, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import SelectInput from '@mui/material/Select/SelectInput'
import axios from 'axios'

function App() {
  const [emailContent, setEmailContent] = useState("")
  const [tone, setTone]=useState("")
  const [generatedReply, setGeneratedReply]=useState("")
  const [loading, setLoading]=useState(false)
  const [error, setError]=useState("")
  const handleSubmit=async()=>{
    setLoading(true);
    setError("");
    try {
      const response=await axios.post("http://localhost:8080/api/email/generate", {emailContent, tone})
      setGeneratedReply(typeof response.data === "string" ? response.data : JSON.stringify(response.data))
    } catch (error) {
      setError("Failed to generate email. Please try again.");
      console.error(error)
    } finally{
      setLoading(false)
    }
  }

  return (
    <>
    <Container maxWidth="md" sx={{py: 4}}>
      <Typography variant='h3' component="h1" gutterBottom>Generated email content: </Typography>
      <Box sx={{mx: 3}}>
        <TextField 
        fullWidth 
        variant='outlined' 
        multiline 
        rows={6} 
        label="Original email content: "
        value={emailContent || ""}
        onChange={(e) => setEmailContent(e.target.value)}
        sx={{mb: 2}}></TextField>
      </Box>

      <FormControl fullWidth>
        <InputLabel>Tone (Optional)</InputLabel>
        <Select value={tone || ""}
        label={"Tone (Optional)"}
        onChange={(e)=> setTone(e.target.value)}>
          <MenuItem value="">None</MenuItem>
          <MenuItem value="professional">Professionnal</MenuItem>
          <MenuItem value="friendly">Friendly</MenuItem>
          <MenuItem value="sarcastic">Sarcastic</MenuItem>
        </Select>
      </FormControl>
      <Button variant='contained'
      fullWidth
      onClick={handleSubmit}
      disabled={!emailContent || loading}
      >
        {loading? <CircularProgress size={24}></CircularProgress>: "Generate reply" }

      </Button>


      {error && <Typography color='error' sx={{mb: 4}}>{error}</Typography>}

      {generatedReply && <Box>
        <Typography variant='h6' gutterBottom>
          <TextField 
          sx={{my: 4}}
          fullWidth
          variant='outlined'
          multiline
          rows={6}
          value={generatedReply || ""}
          inputProps={{"aria-readonly": true}} />
        </Typography>
        <Button
        variant='outlined'
        sx={{mt: 2}}
        onClick={()=> navigator.clipboard.writeText(generatedReply)}
        >Copy to clipboard</Button>
        </Box>}
    </Container>
    </>
  )
}

export default App
