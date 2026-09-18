import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { Button, Field, PageTitle } from '../components/ui'
import { useDemo } from '../state/DemoContext'

const asset = (name: string) => `${import.meta.env.BASE_URL}assets/figma/${name}`

export function LoginScreen() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('lana@exemple.be')
  const [password, setPassword] = useState('referio-demo')
  return (
    <AppShell>
      <PageTitle eyebrow="BON RETOUR" title="Connecte-toi à ton quartier." body="Retrouve tes pépites, tes passeports et ta progression locale." />
      <Field label="Adresse e-mail" value={email} onChange={setEmail} helper="Utilise une adresse de démonstration." />
      <Field label="Mot de passe" value={password} onChange={setPassword} />
      <Link className="text-link" to="/client/forgot-password">Mot de passe oublié&nbsp;?</Link>
      <div className="screen-spacer" />
      <Button full onClick={() => navigate('/client/home')}>Se connecter</Button>
      <Button full variant="ghost" onClick={() => navigate('/client/signup')}>Créer un compte</Button>
    </AppShell>
  )
}

export function SignupScreen() {
  const navigate = useNavigate()
  return (
    <AppShell>
      <PageTitle eyebrow="BIENVENUE" title="Crée ton passeport local." body="Quelques informations suffisent pour commencer." />
      <Field label="Prénom" value="Lana" />
      <Field label="Adresse e-mail" value="lana@exemple.be" />
      <Field label="Mot de passe" value="referio-demo" />
      <label className="consent"><input type="checkbox" defaultChecked /> <span>J’accepte les conditions de démonstration et la politique de confidentialité.</span></label>
      <div className="screen-spacer" />
      <Button full onClick={() => navigate('/client/permissions/location')}>Créer mon compte</Button>
    </AppShell>
  )
}

export function ForgotPasswordScreen() {
  const [sent, setSent] = useState(false)
  return (
    <AppShell tone="info">
      <PageTitle eyebrow="RÉCUPÉRATION" title="On te renvoie le chemin." body="Saisis ton adresse et nous simulerons l’envoi d’un lien sécurisé." />
      <Field label="Adresse e-mail" value="lana@exemple.be" />
      <div className="tip-card"><strong>Bon à savoir</strong><p>Le lien de démonstration expire après 20 minutes et ne quitte pas ton navigateur.</p></div>
      {sent && <p className="inline-success" role="status">Le lien simulé a été envoyé.</p>}
      <div className="screen-spacer" />
      <Button full onClick={() => setSent(true)}>Envoyer le lien</Button>
      <Link className="button button--ghost button--full" to="/client/login">Retour à la connexion</Link>
    </AppShell>
  )
}

export function LocationPermissionScreen() {
  const navigate = useNavigate()
  const { dispatch } = useDemo()
  return (
    <AppShell tone="sun">
      <PageTitle eyebrow="AUTOUR DE TOI" title="Trouve les bonnes adresses, juste à côté." body="La position sert uniquement à classer les commerces par proximité dans cette démo." />
      <img className="permission-art" src={asset('permission-location.jpg')} alt="Carte locale illustrée" />
      <div className="tip-card"><strong>Tu gardes la main</strong><p>Tu peux modifier ce choix à tout moment dans les paramètres.</p></div>
      <div className="screen-spacer" />
      <Button full onClick={() => { dispatch({ type: 'SET_CITY', city: 'Charleroi' }); navigate('/client/permissions/notifications') }}>Autoriser la localisation</Button>
      <Button full variant="ghost" onClick={() => navigate('/client/permissions/notifications')}>Pas maintenant</Button>
    </AppShell>
  )
}

export function NotificationPermissionScreen() {
  const navigate = useNavigate()
  return (
    <AppShell tone="lime">
      <PageTitle eyebrow="RIEN D’INUTILE" title="Des nouvelles locales qui valent le coup." body="Choisis les alertes utiles : récompenses, favoris et challenges." />
      <img className="permission-art" src={asset('permission-notifications.jpg')} alt="Notifications locales illustrées" />
      <div className="notification-prefs"><p>Récompense bientôt expirée</p><p>Nouveau commerce favori</p><p>Challenge presque terminé</p></div>
      <div className="screen-spacer" />
      <Button full onClick={() => navigate('/client/home')}>Activer les notifications</Button>
      <Button full variant="ghost" onClick={() => navigate('/client/home')}>Choisir plus tard</Button>
    </AppShell>
  )
}
