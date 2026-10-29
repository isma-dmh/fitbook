<?php

namespace App\Security;

use App\Entity\Utilisateur;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAccountStatusException;
use Symfony\Component\Security\Core\User\UserCheckerInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class UserChecker implements UserCheckerInterface
{
    public function checkPreAuth(UserInterface $user): void {}

    public function checkPostAuth(UserInterface $user, ?\Symfony\Component\Security\Core\Authentication\Token\TokenInterface $token = null): void
    {
        if (!$user instanceof Utilisateur) {
            return;
        }
        if (!$user->isActif()) {
            throw new CustomUserMessageAccountStatusException('Compte désactivé.');
        }
        if (!$user->isEmailVerifie()) {
            throw new CustomUserMessageAccountStatusException('Email non confirmé.');
        }
    }
}
