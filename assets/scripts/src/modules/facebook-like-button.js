export default function facebookLikeButton(d, s, id) {
  const fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  const js = d.createElement(s);

  js.id = id;
  js.src = '//connect.facebook.net/pl_PL/sdk.js#xfbml=1&version=v2.8&appId=203230033472373';
  fjs.parentNode.insertBefore(js, fjs);
}
